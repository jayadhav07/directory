const addRow = document.querySelector(".add-row");
const table = document.querySelector(".table");
const findBtn = document.querySelector(".find-btn");
const tabInfo = document.querySelector(".tab");
const addNewPerson = document.querySelector(".add-new-person");
const retrieveInfo = document.querySelector(".retrieve-info");

const directoryData = [];

//Callback function for addRow
const addNewRow = () => {
  const createRow = `
                <tr>
                    <td><input type="text" value=""></td>
                    <td><input type="date" value=""></td>
                    <td><input type="number" value="" maxlength="12"></td>
                    <td><input type="number" value="" maxlength="10"></td>
                    <td class="age"></td>
                    <td>
                        <button class="save">Save</button>
                        <button class="delete">Delete</button>
                    </td>
                </tr>
    `;

  table.innerHTML += createRow;
};

const handleActions = (e) => {
  //Save button
  const parent = e.target.parentNode.parentNode;
  const inputs = parent.querySelectorAll("input");

  const inputValues = Array.from(inputs).map((input) => {
    input.setAttribute("value", input.value);
    return input.value;
  });

  if (e.target.classList.contains("save")) {
    //Seletors
    const showMessage = document.querySelector(".error-message");
    showMessage.innerHTML = "";

    //Validation for empty fields
    if (inputValues[0].length == 0 || inputValues[1].length == 0) {
      showMessage.innerHTML = `<p>Please fill all the inputs field</p>`;
      return;
    }

    //Validation for aadhar number
    if (inputValues[2].length < 12 || inputValues[3].length < 10) {
      showMessage.innerHTML += `
                    <p>Plase check Aadhar and Mobile Number<p>
                    <p>Aadhar number must be of 12 digits<p>
                    <p>Mobile Number must be of 10 digits<p>
            `;
      return;
    }

    //Converting Date to age;
    const ageInDays =
      (Date.now() - Date.parse(inputValues[1])) / (1000 * 60 * 60 * 24);
    const age = Math.floor(ageInDays / 365);

    const ageElement = parent.querySelector(".age");
    ageElement.innerText = age;

    const userData = {
      Name: `${inputValues[0]}`,
      "Date of Birth": `${inputValues[1]}`,
      "Aadhar Number": `${inputValues[2]}`,
      "Mobile Number": `${inputValues[3]}`,
      Age: `${age}`,
    };

    directoryData.push(userData);

    //Saving the data in localStorage
    localStorage.setItem("data", JSON.stringify(directoryData));
  }

  //Delete button
  if (e.target.classList.contains("delete")) {
    const localStorageData = JSON.parse(localStorage.getItem("data"));

    //Removing data from localStorage on delete
    localStorageData.forEach((data, index) => {
      if (data["Aadhar Number"] === inputValues[2]) {
        directoryData.splice(index, 1);
        localStorage.setItem("data", JSON.stringify(directoryData));
      }
    });

    //Deleting the row;
    parent.remove();
  }
};

const retrieveData = () => {
  //Selectors
  const cardSection = document.querySelector(".card-section");
  const inputValue = document.querySelector(".search").value;
  const localStorageData = JSON.parse(localStorage.getItem("data"));

  //Fetching Data from localStorage
  const userData = localStorageData.filter(
    (user) => user["Aadhar Number"] === inputValue
  );

  //Creating card Container
  const informationCard = `
            
                    <div class="Box">
                        <p>Name:  ${userData[0]["Name"]} </p>
                        <p>DOB: ${userData[0]["Date of Birth"]}</p>
                        <p>Aadhar No: ${userData[0]["Aadhar Number"]}</p>
                        <p>Mobile No: ${userData[0]["Mobile Number"]}</p>
                        <p>Age: ${userData[0]["Age"]}</p>
                    </div>
    `;

  //Appending cardContainer to cardSection
  cardSection.innerHTML = informationCard;
};

const hideRetrieve = () => {
  //Selectors
  const infoTable = document.querySelector(".information-table");
  const retrieveSection = document.querySelector(".retrieve-section");

  //If infoTable is hidden, hide retrieveSection and display infotable
  if (infoTable.style.display === "none") {
    retrieveSection.style.display = "none";
    infoTable.style.display = "";
    tabInfo.innerText = "Add New Person";
  }
};

const hideInfoTable = () => {
  //Selectors
  const infoTable = document.querySelector(".information-table");
  const retrieveSection = document.querySelector(".retrieve-section");

  //If retrieveSection is hiddern, hide infotable and display retrieveSection
  if (retrieveSection.style.display === "none") {
    infoTable.style.display = "none";
    retrieveSection.style.display = "";
    tabInfo.innerText = "Retrieve Information";
  }
};

//Adding new Row on click on Add button
addRow.addEventListener("click", addNewRow);

//Saving data to localstorage and deleting rows and localstorage data
table.addEventListener("click", handleActions);

//Searches for the user data in localStorage using Aadhar Number
findBtn.addEventListener("click", retrieveData);

//Shows Add new Person page an hides Retrieve Section
addNewPerson.addEventListener("click", hideRetrieve);

//Shows Retreive Information page an hides Add new person Section
retrieveInfo.addEventListener("click", hideInfoTable);