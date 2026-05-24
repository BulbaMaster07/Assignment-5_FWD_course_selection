let selectedCourses = [];
let isSubmitted = false;

window.onload = function(){

  const savedCourses =
    localStorage.getItem("confirmedCourses");
  const savedStatus =
    localStorage.getItem("submissionStatus");

  if(savedCourses){
    selectedCourses =
      JSON.parse(savedCourses);
    updateSelectedCourses();
    highlightSavedCards();
  }

  if(savedStatus === "submitted"){
    isSubmitted = true;
    lockSelections();
  }

  showDate();
};

function showDate(){
  const now = new Date();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  const formattedDate =
    days[now.getDay()] +
    ", " +
    now.getDate() +
    " " +
    months[now.getMonth()] +
    " " +
    now.getFullYear();
  document.getElementById("current-date")
    .textContent = formattedDate;
}

function selectCourse(event, courseName){
  if(isSubmitted){
    return;
  }
  const selectedCard =
    event.target.closest(".course-card");

  if(selectedCourses.includes(courseName)){
    selectedCourses =
      selectedCourses.filter(function(course){
        return course !== courseName;
      });
    selectedCard.classList.remove("active");
    updateSelectedCourses();
    alert(courseName + " deselected.");
    return;
  }

  selectedCourses.push(courseName);
  selectedCard.classList.add("active");
  updateSelectedCourses();
  alert(courseName + " selected successfully!");
}

function updateSelectedCourses(){
  const selectedBox = document.getElementById("selected-course");
  const countBox = document.getElementById("selection-count");
  countBox.textContent = selectedCourses.length;
  if(selectedCourses.length === 0){
    selectedBox.innerHTML =
      "No course selected yet.";
    return;
  }

  let courseList = "<ul>";
  selectedCourses.forEach(function(course){
    courseList += `
      <li>
        ${course}
        ${
          !isSubmitted
          ?
          `<button
            class="remove-course"
            onclick="removeCourse('${course}')"
          >
            ×
          </button>`
          :
          ""
        }
      </li>
    `;
  });

  courseList += "</ul>";
  selectedBox.innerHTML = courseList;
}

function removeCourse(courseName){

  if(isSubmitted){
    return;
  }
  selectedCourses =
    selectedCourses.filter(function(course){
      return course !== courseName;
    });

  const cards =
    document.querySelectorAll(".course-card");
  cards.forEach(function(card){
    if(card.innerText.includes(courseName)){
      card.classList.remove("active");
    }
  });

  updateSelectedCourses();
  alert(courseName + " removed.");
}

function confirmSelection(){
  if(selectedCourses.length === 0){
    alert("Please select at least one course.");
    return;
  }

  localStorage.setItem("confirmedCourses",JSON.stringify(selectedCourses));

  localStorage.setItem("submissionStatus","submitted");

  isSubmitted = true;
  lockSelections();
  alert("Course registration submitted successfully!");
}

function lockSelections(){

  const statusBadge =
    document.getElementById("status-badge");
  const confirmBtn =
    document.getElementById("confirm-btn");
  statusBadge.textContent =
    "Submitted";
  statusBadge.classList.remove("draft");
  statusBadge.classList.add("submitted");
  confirmBtn.disabled = true;
  confirmBtn.textContent =
    "Submission Completed";
  const cards =
    document.querySelectorAll(".course-card");
  cards.forEach(function(card){
    card.classList.add("locked");
  });

  updateSelectedCourses();
}

function highlightSavedCards(){

  const cards =
    document.querySelectorAll(".course-card");
  cards.forEach(function(card){
    selectedCourses.forEach(function(course){
      if(card.innerText.includes(course)){
        card.classList.add("active");
      }
    });
  });
}

//to reset the portal for testing purposes. In console, run resetPortal() to clear localStorage and reload the page.
function resetPortal(){
  localStorage.clear();
  location.reload();
}