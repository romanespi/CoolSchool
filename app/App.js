//------------------------ Clase de materias -----------------------------------
class Subject {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    show() {
        return '<td>' + this.name + '</td><td id="btnActions"><a href="#"><img id="btnDelete" src="app/assets/borrar.png"></a><a href="#"><img id="btnEdit" src="app/assets/editar.png"></a></td>';
    }

    add() {
        let subjects = JSON.parse(localStorage.getItem('subjects')) || [];
        subjects.push(this);
        localStorage.setItem('subjects', JSON.stringify(subjects));
    }

    static remove(id) {
        let subjects = JSON.parse(localStorage.getItem('subjects')) || [];
        subjects = subjects.filter(subject => subject.id !== id);
        localStorage.setItem('subjects', JSON.stringify(subjects));
    }
}

//------------------------ Clase de Grupo -----------------------------------
class Group {
    constructor(id, name, studentIds) {
        this.id = id;
        this.name = name;
        this.studentIds = studentIds;
    }

    show() {
        return '<td>' + this.name + '</td><td id="btnActions"><a href="#"><img id="btnDelete" src="app/assets/borrar.png"></a><a href="#"><img id="btnEdit" src="app/assets/editar.png"></a></td>';
    }

    add() {
        let groups = JSON.parse(localStorage.getItem('groups')) || [];
        groups.push(this);
        localStorage.setItem('groups', JSON.stringify(groups));
    }

    static remove(id) {
        let groups = JSON.parse(localStorage.getItem('groups')) || [];
        groups = groups.filter(group => group.id !== id);
        localStorage.setItem('groups', JSON.stringify(groups));
    }
}


//------------------------ Clase de estudiante -----------------------------------
class Student {
    constructor(id, firstName, lastName, age, subjectsGrades = {}) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
        this.subjectsGrades = subjectsGrades;
    }
//----------------------- Metodos de la clase estudiantes  ------------------------------------------------
    show() {
        return '<td>' + this.firstName + '</td><td>' + this.lastName + '</td><td>' + this.age + '</td><td id="btnActions"><a href="#"><img id="btnDelete" src="app/assets/borrar.png"></a><a href="#"><img id="btnEdit" src="app/assets/editar.png"></a></td>';
    }

    add() {
        let students = JSON.parse(localStorage.getItem('students')) || [];
        students.push(this);
        localStorage.setItem('students', JSON.stringify(students));
    }

    static eliminar(id) {
        let students = JSON.parse(localStorage.getItem('students')) || [];
        students = students.filter(student => student.id !== id);
        localStorage.setItem('students', JSON.stringify(students));
    }

    static showEdit(firstName, lastName, age) {
        $studentName.innerHTML = `Alumno: ${firstName} ${lastName}`;
        $studentAge.innerHTML = `Edad: ${age}`;
    }

}

//--------------------------- Control del menú de navegación -------------------------------

let d = document;
let $studentView = d.getElementById("students");
let $groupsView = d.getElementById("groups");
let $subjectsView = d.getElementById("subjects");
let $inscriptionView = d.getElementById("inscription");
let $btnStudents = d.getElementById("btnStudents");
let $btnGroups = d.getElementById("btnGroups");
let $btnSubjects = d.getElementById("btnSubjects");
let $studentsTable = d.getElementById("studentsTable");
let $groupsTable = d.getElementById("groupsTable");
let $subjectsTable = d.getElementById("subjectsTable");
let $studentName = d.getElementById("studentName");
let $studentAge = d.getElementById("studentAge");
let $studentSubject = d.getElementById("studentSubject");
let $studentGrade = d.getElementById("studentGrade");
let editingStudentId = null;

function hideAll() {
    $inscriptionView.style.display = "none";
    $studentView.style.display = "none";
    $groupsView.style.display = "none";
    $subjectsView.style.display = "none";
}

function studentView() {
    hideAll();
    $studentView.style.display = "block";
    showStudentsTable();
}

function groupsView() {
    hideAll();
    $groupsView.style.display = "block";
    showGroupsTable();
}

function subjectsView() {
    hideAll();
    $subjectsView.style.display = "block";
    showSubjectsTable();
}

function inscriptionView() {
    hideAll();
    $inscriptionView.style.display = "block";
}

$btnStudents.addEventListener("click", studentView);
$btnGroups.addEventListener("click", groupsView);
$btnSubjects.addEventListener("click", subjectsView);


//-------------------------------- Función para mostrar los estudiantes --------------------------
function showStudentsTable() {
    let students = JSON.parse(localStorage.getItem('students')) || [];
    let subjects = JSON.parse(localStorage.getItem('subjects')) || [];
    while ($studentsTable.rows.length > 1) {
        $studentsTable.deleteRow(1);
    }
    
    students.forEach(function(student) {
        let row = document.createElement('tr');
        row.innerHTML = new Student(student.id, student.firstName, student.lastName, student.age).show();
        $studentsTable.appendChild(row);
        row.querySelector('#btnDelete').addEventListener('click', function() {
            Student.eliminar(student.id);
            showStudentsTable();
        });
        row.querySelector('#btnEdit').addEventListener('click', function() {
           inscriptionView();
           console.log(student);
           editingStudentId = student.id;
           Student.showEdit(student.firstName, student.lastName, student.age);
           $studentSubject.innerHTML = `<option>-- Seleccione una opción --</option>`;
           subjects.forEach(function (subject) {
            $studentSubject.innerHTML += `<option>${subject.name}</option>`;
            showStudentGradesTable(editingStudentId);
           });
           
        });
    });
}

//-------------------------------- Agregar un nuevo estudiante ------------------------------
document.getElementById('studentRegistrationForm').addEventListener('submit', function(e) {
    e.preventDefault();

    let id = Date.now();
    let firstName = document.getElementById('firstName').value;
    let lastName = document.getElementById('lastName').value;
    let age = document.getElementById('age').value;

    let studentData = new Student(id, firstName, lastName, age);

    studentData.add();
    showStudentsTable();

    d.getElementById('firstName').value = "";
    d.getElementById('lastName').value = "";
    d.getElementById('age').value = "";
});

//------------------------------- Evento para registrar materias -------------------------
d.getElementById('btnSingUp').addEventListener('click', function(e) {
    e.preventDefault();
    let selectedSubject = $studentSubject.value;

    let students = JSON.parse(localStorage.getItem('students')) || [];
    for (let i = 0; i < students.length; i++) {
        if (students[i].id === editingStudentId) {
            students[i].subjectsGrades[selectedSubject] = null;
            break;
        }
    }
    localStorage.setItem('students', JSON.stringify(students));
    showStudentGradesTable(editingStudentId);
});

//------------------------------- Evento para registrar calificaciones -------------------------
d.getElementById('btnAssing').addEventListener('click', function(e) {
    e.preventDefault();
    let selectedSubject = $studentSubject.value;
    let grade = $studentGrade.value;

    let students = JSON.parse(localStorage.getItem('students')) || [];
    for (let i = 0; i < students.length; i++) {
        if (students[i].id === editingStudentId) {
            if (students[i].subjectsGrades.hasOwnProperty(selectedSubject)) {
                students[i].subjectsGrades[selectedSubject] = grade;
            } else {
                alert('El estudiante no está inscrito en esta materia');
                return;
            }
            break;
        }
    }
    localStorage.setItem('students', JSON.stringify(students));
    showStudentGradesTable(editingStudentId);
});

//------------------------------- Función para mostrar las calificaciones ------------------------

function showStudentGradesTable(studentId) {
    let students = JSON.parse(localStorage.getItem('students')) || [];
    let studentSubjectsTable = document.getElementById('studentSubjectsTable');
    let studentAverageDisplay = document.getElementById('studentAverage'); 

    while (studentSubjectsTable.rows.length > 1) {
        studentSubjectsTable.deleteRow(1);
    }

    let student = students.find(student => student.id === studentId);
    if (student) {
        let totalGrades = 0;
        let numSubjects = 0;

        for (let subject in student.subjectsGrades) {
            let row = document.createElement('tr');

            row.innerHTML = `<td>${subject}</td><td>${student.subjectsGrades[subject]}</td><td id="btnActions"><a href="#"><img id="btnDelete" src="app/assets/borrar.png"></a>`;

            studentSubjectsTable.appendChild(row);

            row.querySelector('#btnDelete').addEventListener('click', function() {
                delete student.subjectsGrades[subject];

                localStorage.setItem('students', JSON.stringify(students));

                showStudentGradesTable(studentId);
            });

            totalGrades += parseInt(student.subjectsGrades[subject]);
            numSubjects++;
        }

        let average = totalGrades / numSubjects;

        studentAverageDisplay.innerText = `Promedio: ${average.toFixed(2)}`;
    } else {
        console.log(`No se encontró un estudiante con el id ${studentId}`);
    }
}



//------------------------------- Función para mostrar los grupos --------------------------------
function showGroupsTable() {
    let groups = JSON.parse(localStorage.getItem('groups')) || [];
    console.log(groups);
    while ($groupsTable.rows.length > 1) {
        $groupsTable.deleteRow(1);
    }
    
    groups.forEach(function(group) {
        let row = d.createElement('tr');
        row.innerHTML = new Group(group.id, group.name, group.studentIds).show();
        $groupsTable.appendChild(row);
        row.querySelector('#btnDelete').addEventListener('click', function() {
            Group.remove(group.id);
            showGroupsTable();
        });
    });
}

//------------------------------ Evento para registrar los grupos ----------------------
document.getElementById('groupRegistrationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    let id = Date.now();
    let groupName = document.getElementById('groupName').value;

    let groupData = new Group(id, groupName);

    groupData.add();
    showGroupsTable();
});

//------------------------------- Función para mostrar las materias --------------------------------
function showSubjectsTable() {
    let subjects = JSON.parse(localStorage.getItem('subjects')) || [];
    console.log(subjects);
    while ($subjectsTable.rows.length > 1) {
        $subjectsTable.deleteRow(1);
    }
    
    subjects.forEach(function(subject) {
        let row = d.createElement('tr');
        row.innerHTML = new Subject(subject.id, subject.name).show();
        $subjectsTable.appendChild(row);
        row.querySelector('#btnDelete').addEventListener('click', function() {
            Subject.remove(subject.id);
            showSubjectsTable();
        });
    });
}

//------------------------------ Evento para registrar las materias ----------------------
document.getElementById('subjectRegistrationForm').addEventListener('submit', function(e) {
    e.preventDefault();

    let id = Date.now();
    let subjectName = document.getElementById('subjectName').value;

    let subjectData = new Subject(id, subjectName);

    subjectData.add();
    showSubjectsTable();
});

