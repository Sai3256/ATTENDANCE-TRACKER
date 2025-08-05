
    const subjects = ["Software Engineering", "Advanced COA", "IoT", "FLAT", "Operating Systems", "Data Communication"];
    let students = [
      { rollNo: '101', name: 'Aarav Mehta' },
      { rollNo: '102', name: 'Ishita Nair' },
      { rollNo: '103', name: 'Kunal Desai' },
      { rollNo: '104', name: 'Saanvi Sharma' }
    ];
    const subjectSelect = document.getElementById("subject");
    const deleteDropdown = document.getElementById("deleteSelect");
    const studentTable = document.getElementById("studentTable");
    const themeIcon = document.getElementById("themeIcon");

    function renderSubjects() {
      subjectSelect.innerHTML = "";
      subjects.forEach(sub => {
        const option = document.createElement("option");
        option.value = sub;
        option.textContent = sub;
        subjectSelect.appendChild(option);
      });
    }
    function renderStudents() {
      studentTable.innerHTML = "";
      students.forEach(student => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${student.rollNo}</td>
          <td>${student.name}</td>
          <td>
            <select>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
            </select>
          </td>
        `;
        studentTable.appendChild(row);
      });
      renderDeleteOptions();
    }
    function renderDeleteOptions() {
      deleteDropdown.innerHTML = "";
      students.forEach(s => {
        const opt = document.createElement("option");
        opt.value = s.rollNo;
        opt.textContent = `${s.rollNo} - ${s.name}`;
        deleteDropdown.appendChild(opt);
      });
    }
    function addStudent() {
      const roll = prompt("Enter Roll No:");
      const name = prompt("Enter Name:");
      if (!roll || !name) return;
      if (students.some(s => s.rollNo === roll)) return alert("Duplicate Roll No");
      students.push({ rollNo: roll, name: name });
      renderStudents();
    }
    function deleteStudent() {
      const roll = deleteDropdown.value;
      students = students.filter(s => s.rollNo !== roll);
      renderStudents();
    }
    function addSubject() {
      const sub = prompt("Enter Subject Name:");
      if (!sub || subjects.includes(sub)) return;
      subjects.push(sub);
      renderSubjects();
    }
    function deleteSubject() {
      const sub = subjectSelect.value;
      if (!sub) return;
      const index = subjects.indexOf(sub);
      if (index !== -1) subjects.splice(index, 1);
      renderSubjects();
    }
    function submitAttendance() {
      const subject = subjectSelect.value;
      const date = document.getElementById("date").value;
      if (!subject || !date) return alert("Select both subject and date");
      const rows = document.querySelectorAll("#studentTable tr");
      const data = Array.from(rows).map((row, i) => {
        return {
          rollNo: students[i].rollNo,
          status: row.querySelector("select").value
        };
      });
      const key = `${subject}_${date}`;
      localStorage.setItem(key, JSON.stringify(data));
      alert("Attendance submitted.");
    }
    function showAttendanceRecord() {
      const subject = subjectSelect.value;
      const date = document.getElementById("date").value;
      if (!subject || !date) return alert("Select both subject and date");
      const key = `${subject}_${date}`;
      const record = JSON.parse(localStorage.getItem(key));
      if (!record) return alert("No record found");
      let list = record.map(s => `${s.rollNo}: ${s.status}`).join("\n");
      alert(list);
    }
    function showGradeBack() {
      const month = document.getElementById("monthInput").value;
      const counts = {};
      const presents = {};
      for (let key in localStorage) {
        if (!localStorage.hasOwnProperty(key)) continue;
        if (!key.includes("_")) continue;
        const [sub, date] = key.split("_");
        if (!date.startsWith(month)) continue;
        const data = JSON.parse(localStorage.getItem(key));
        data.forEach(entry => {
          counts[entry.rollNo] = (counts[entry.rollNo] || 0) + 1;
          if (entry.status === "present")
            presents[entry.rollNo] = (presents[entry.rollNo] || 0) + 1;
        });
      }
      const result = [];
      students.forEach(s => {
        const total = counts[s.rollNo] || 0;
        const present = presents[s.rollNo] || 0;
        const percent = total === 0 ? 100 : (present / total) * 100;
        if (percent < 75) {
          result.push(`${s.rollNo} - ${s.name} (${percent.toFixed(1)}%)`);
        }
      });
      const list = document.getElementById("gradeBackList");
      list.innerHTML = "";
      result.forEach(r => {
        const li = document.createElement("li");
        li.textContent = r;
        list.appendChild(li);
      });
      document.getElementById("overlay").classList.add("active");
      document.getElementById("modal").classList.add("active");
    }
    function closeModal() {
      document.getElementById("overlay").classList.remove("active");
      document.getElementById("modal").classList.remove("active");
    }
    function toggleTheme() {
      document.body.classList.toggle("dark");
      themeIcon.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
    }
    renderSubjects();
    renderStudents();
