
// Table Header Creation
const generateHeader = (requiredTableColumns) => {
    let tableHeadersRows = "";
    requiredTableColumns.forEach(Column => {
        tableHeadersRows += `<th>${Column}</th>`
    });
    return `<tr>${tableHeadersRows}<th></th></tr>`;
};

function onEdit(details, type) {
    console.log("Edit of type", details, type);
    if (type == "emp") {
        updatePersonnel(details);
        //  alert("its an employee");
    }


    else if (type == "dept") {
        updateDepartment(details);
        // alert("its a departmment");
    }
    else if (type == "loc") {
        updateLocation(details);

        //  alert("its location");
    }

}



function onDelete(details, type) {
    console.log("Delete", details);
    if (type == "emp") {
        deleteFromPersonnel(details);

    }
    else if (type == "dept") {
        deleteFromDepartment(details);

    }
    else if (type == "loc") {
        deleteFromLocation(details);

    }

}


// Table Rows Creation
function generateRows(tableDetails, requiredTableColumns = null, type) {
    let tableRows = [];

    tableDetails.forEach(tableDetail => {
        let tableTDs = "";
        const onEditClick = () => {
            return onEdit(tableDetail, type)
        };


        const onDeleteClick = () => {
            return onDelete(tableDetail, type)
        };
        requiredTableColumns.forEach(Column => {
            tableTDs += `<td>${tableDetail[Column]}</td>`
        });
        // const customTdElement =
        const editButton = createButton("Edit", onEditClick);
        const deleteButton = createButton("Delete", onDeleteClick);
        let customTDElement = document.createElement("td");
        customTDElement.setAttribute("class", "col-2");
        customTDElement.appendChild(editButton);
        customTDElement.appendChild(deleteButton);
        tableRows.push($(`<tr>${tableTDs}/tr>`).append(customTDElement));
    });

    return tableRows;
}

//Button Creation
function createButton(name, onClickTriggerMethod) {
    const button = document.createElement("button");
    button.setAttribute("class", "btn-sm btn-default m-1 glyphicon glyphicon-pencil");
    if (name === "Edit") {
        button.innerHTML = `<i class="bi bi-pencil"></i>`;
    }

    if (name === "Delete") {
        button.innerHTML = `<i class="bi bi-trash-fill"></i>`;
    }

    button.onclick = onClickTriggerMethod;

    return button;
}

// Table Creation
//Info: generateTable Method returs table header and table body to render inside the tab container
function generateTable(tableDetails, requiredTableColumns = null, type) {
    const tableHeaders = $("<thead>").append(generateHeader(requiredTableColumns));
    const tableBody = $('<tbody>');
    const tableRows = generateRows(tableDetails, requiredTableColumns, type);
    tableRows.forEach((tableRow) => {
        tableBody.append(tableRow);
    })
    return {
        tableHeaders,
        tableBody,
    }
}

$('#saveEmpInsert').on('click', function (e) {
    //     // do something...
    alert("insert clicked");
})


/////////////////////////////////////
$(document).ready(function () {

    ///////preloader/////////
    $(window).on('load', function () {
        if ($('#preloader').length) {
            $('#preloader').delay(1000).fadeOut('slow', function () {
                $(this).remove();
            });
        }
    });

    generateEmpTable();
    generateDeptTable();
    generateLocTable();

});

function generateEmpTable() {
    const type = "emp";
    console.log("generating emp table....", type);

    $.ajax({
        url: './assets/dist/php/getAll.php',
        type: 'POST',

        success: (response) => {
            let tableDetails = response.data;
            const {
                tableHeaders,
                tableBody
            } = generateTable(tableDetails, ['firstName', 'lastName', 'email', 'department', 'location'], type);
            $('#employeeTable').empty();
            $('#employeeTable').append(tableHeaders);
            $('#employeeTable').append(tableBody);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            //console.log("id sent",id);
            console.log("failed");
            console.log(errorThrown);
            console.log(jqXHR.responseText);
            console.log(textStatus);
        }

    });

}

function generateDeptTable() {
    const type = "dept";
    console.log("generating dept table....");

    $.ajax({
        url: './assets/dist/php/getAllDepartments.php',
        type: 'POST',

        success: (response) => {
            let tableDetails = response.data.dept;
            const {
                tableHeaders,
                tableBody
            } = generateTable(tableDetails, ['Department', 'Location'], type);
            $('#departmentTable').empty();
            $('#departmentTable').append(tableHeaders);
            $('#departmentTable').append(tableBody);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            //console.log("id sent",id);
            console.log("failed");
            console.log(errorThrown);
            console.log(jqXHR.responseText);
            console.log(textStatus);
        }
    });
}


function generateLocTable() {
    const type = "loc";
    console.log("generating location table....");

    $.ajax({
        url: './assets/dist/php/getAllDepartments.php',
        type: 'POST',

        success: (response) => {
            let tableDetails = response.data.loc;
            const {
                tableHeaders,
                tableBody
            } = generateTable(tableDetails, ['name'], type);
            $('#locationTable').empty();
            $('#locationTable').append(tableHeaders);
            $('#locationTable').append(tableBody);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            //console.log("id sent",id);
            console.log("failed");
            console.log(errorThrown);
            console.log(jqXHR.responseText);
            console.log(textStatus);
        }

    });

}

///////////////Employee////////////////

////////populatedept select drop down
$('#empInsertBtn').on('click', function () {

    //let optiondv=null;
    // let optionlv=null;


    document.getElementById('inputDept').options.length = 0;
    //document.getElementById('inputLocation').options.length=0;
    $.ajax({
        url: './assets/dist/php/getAllDepartments.php',
        type: 'POST',
        success: (response) => {
            console.log("alldept", response.data.dept);
            let departments = response.data.dept;
            let optiondv = `<option value="">---Select Department---</option>`;
            departments.forEach(d => {
                console.log(d.department);
                optiondv += `<option value=${d.id}>${d.Department}</option>`;
            });

            $("#inputDept").append(optiondv).select();

        },
        error: function (jqXHR, textStatus, errorThrown) {

            console.log("failed");
            console.log(errorThrown);
            console.log(jqXHR.responseText);
            console.log(textStatus);
        }
    });

    $('#empInsertModal').modal('show');
})
   

$('#deptInsertBtn').on('click', function () {

    

    document.getElementById('inputLocation').options.length = 0;

    $.ajax({
        url: './assets/dist/php/getAllDepartments.php',
        type: 'POST',
        success: (response) => {
            console.log("alldept", response.data.loc);
            let locations = response.data.loc;
            let optionlv = `<option value="">---Select Department---</option>`;
            locations.forEach(l => {
                console.log(l.name);
                optionlv += `<option value=${l.id}>${l.name}</option>`;
            });

            $("#inputLocation").append(optionlv).select();

        },
        error: function (jqXHR, textStatus, errorThrown) {

            console.log("failed");
            console.log(errorThrown);
            console.log(jqXHR.responseText);
            console.log(textStatus);
        }
    });

    $('#deptInsertModal').modal('show');
})
///////////location insert//////////

$('#locInsertBtn').on('click', function () {
    $('#locInsertModal').modal('show');
});



/////insert location to db

$("#locInsertForm").submit(function(event) {

    event.preventDefault();

    $('#locInsertModal').modal('hide');
    
    var locToInsert = $('#locName').val();
    console.log("inserting location", locToInsert);
   
    $.ajax({
        url: './assets/dist/php/insertLocation.php',
        type: 'POST',
        data: {
            name: locToInsert,
        },
        success: (response) => {
            if (response.status.name == "ok") {

                generateLocTable();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {

            console.log("failed");
            console.log(errorThrown);
            console.log(jqXHR.responseText);
            console.log(textStatus);
        }
    });

    document.getElementById("locInsertForm").reset();
})


//////////////inserting employee to db///////

$("#empInsertForm").submit(function(event) {

    event.preventDefault();

    $('#empInsertModal').modal('hide');
   

        console.log($('#inputFN').val());
        console.log($('#inputLN').val());
        console.log($('#inputEmail').val());
        let fname = $('#inputFN').val();
        let lname = $('#inputLN').val();//document.getElementById('inputLN');
        let email = $('#inputEmail').val();//document.getElementById('inputEmail');
        let departmentID = $('#inputDept').val();
    
        
        console.log("to insert fname,lname,email,departmentID: ", fname, lname, email, departmentID);
        ////insert to db
        $.ajax({
            url: './assets/dist/php/insertPersonnel.php',
            type: 'POST',
            data: {
                firstName: fname,
                lastName: lname,
                email: email,
                departmentID: departmentID,
            },
            success: (response) => {
                if (response.status.name == 'ok') {
                   
                    generateEmpTable();
                   
                }
    
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("failed");
                console.log(errorThrown);
                console.log(jqXHR.responseText);
                console.log(textStatus);
            }
        });
        document.getElementById("empInsertForm").reset();
})

    
///dept inserting

$("#deptInsertForm").submit(function(event) {

    event.preventDefault();
    $('#deptInsertModal').modal('hide');
   
    let name = $('#deptName').val();


    let locID = $('#inputLocation').val();


    console.log("to insert department name, locid: ", name, locID);

    $.ajax({
        url: './assets/dist/php/insertDepartment.php',
        type: 'POST',
        data: {
            name: name,
            locID: locID,

        },
        success: (response) => {
            if (response.status.name == 'ok') {
               
                generateDeptTable();
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {

            console.log("failed");
            console.log(errorThrown);
            console.log(jqXHR.responseText);
            console.log(textStatus);
        }
    });

    document.getElementById("deptInsertForm").reset();

})
////searching personnel

$('#nameToSearch').on('change', function () {
    // let search = "Sales";//document.getElementById('nameToSearch');
    // search="%"+search+"%";
    document.getElementById('employeeTable').length = 0;
    let s = $(this).val();
    let search = s.toUpperCase();
    $.ajax({
        url: './assets/dist/php/searchAll.php',
        type: 'POST',
        data: {
            search: search,
        },
        success: (response) => {
            console.log("seacrch names result", response.data);
            let tableDetails = response.data;
            const {
                tableHeaders,
                tableBody
            } = generateTable(tableDetails, ['firstName', 'lastName', 'email', 'department', 'location'], type = "emp");
            $('#employeeTable').empty();
            $('#employeeTable').append(tableHeaders);
            $('#employeeTable').append(tableBody);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("failed");
            console.log(errorThrown);
            console.log(jqXHR.responseText);
            console.log(textStatus);
        }
    });

})
//////searching dept
$('#deptToSearch').on('change', function () {
    let s = $(this).val();
    let search = s.toUpperCase();
    $.ajax({
        url: './assets/dist/php/searchDept.php',
        type: 'POST',
        data: {
            search: search
        },
        success: (response) => {
            console.log("seacrch dept result", response.data);
            let tableDetails = response.data;
            const {
                tableHeaders,
                tableBody
            } = generateTable(tableDetails, ['Department', 'Location']);
            $('#departmentTable').empty();
            $('#departmentTable').append(tableHeaders);
            $('#departmentTable').append(tableBody);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("failed");
            console.log(errorThrown);
            console.log(jqXHR.responseText);
            console.log(textStatus);
        }
    });

})





//////updating personnel names,email

function updatePersonnel(details) {


    let id = details['id'];
    let fname = details['firstName'];
    let lname = details['lastName'];//document.getElementById('inputLN');
    let email = details['email'];//document.getElementById('inputEmail');
    let department = details['dId'];
    console.log("update emp for ", fname, lname, id);
    $('#updateFN').val(fname);
    $('#updateLN').val(lname);
    $('#updateEmail').val(email);
    
    document.getElementById('updateDept').options.length = 0;
    
    $.ajax({
        url: './assets/dist/php/getAllDepartments.php',
        type: 'POST',
        success: (response) => {
            console.log("alldept", response.data.dept);
            let departments = response.data.dept;
            let optiondv = `<option value="">...Select..</option>`;
            departments.forEach(d => {
                console.log(d.department);
                optiondv += `<option value=${d.id}>${d.Department}</option>`;
            });

            $("#updateDept").append(optiondv).select();
            $("#updateDept").val(department);

        },
        error: function (jqXHR, textStatus, errorThrown) {

            console.log("failed");
            console.log(errorThrown);
            console.log(jqXHR.responseText);
            console.log(textStatus);
        }
    });
    ///
    $('#empUpdateModal').modal('show');


    $('#empUpdateYes').on('click', function () {


        let deptid = document.getElementById('updateDept').value;
        if (deptid === null) {
            deptid = department;
        }
        fname = $('#updateFN').val();
        lname = $('#updateLN').val();//document.getElementById('inputLN');
        email = $('#updateEmail').val();//document.getElementById('inputEmail');
        console.log("updating emp", fname, lname, email, department, id);
        $.ajax({
            url: './assets/dist/php/updatePersonnel.php',
            type: 'POST',
            data: {
                id: id,
                fname: fname,
                lname: lname,
                email: email,
                departmentID: deptid
            },
            success: (response) => {
                //console.log("seacrch names result",response.data);
                if (response.status.name == "ok") {
                    $('#message').html("Updated record successfully");
                    $('#messageModal').modal('show');
                    generateEmpTable();

                }
                else {
                    alert("could not update");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("failed");
                console.log(errorThrown);
                console.log(jqXHR.responseText);
                console.log(textStatus);
            }
        });
    });//onclickend

}


///update department
function updateDepartment(details) {
    let id = details['id'];
    const Department = details["Department"];
    const Location = details["lId"];
    $('#updatedeptname').val(Department);
    $('#currentLocation').val(Location);
  
    document.getElementById('updateNewLocation').options.length = 0;
    $.ajax({
        url: './assets/dist/php/getAllDepartments.php',
        type: 'POST',
        success: (response) => {
            console.log("alldept", response.data.loc);
            let locations = response.data.loc;
            let optionlv = `<option value="">---Select Location---</option>`;
            locations.forEach(l => {
                console.log(l.name);
                optionlv += `<option value=${l.id}>${l.name}</option>`;
            });

            $("#updateNewLocation").append(optionlv).select();
            $('#updateNewLocation').val(Location);

        },
        error: function (jqXHR, textStatus, errorThrown) {

            console.log("failed");
            console.log(errorThrown);
            console.log(jqXHR.responseText);
            console.log(textStatus);
        }
    });
    /////
    $('#deptUpdateModal').modal('show');
    //get new values fro update modal and send to php for query on click of updateyes
}
    $('#updateYes').on("click", function () {

        let name = $('#updatedeptname').val();
        let locationID = document.getElementById('updateNewLocation').value;
        if (locationID === null) {
            locationID = Location;
        }
        console.log("updating ", name, locationID, id);
        $.ajax({
            url: './assets/dist/php/updateDepartment.php',
            type: 'POST',
            data: {
                id: id,
                name: name,
                locationID: locationID
            },
            success: (response) => {
                console.log("seacrch names result", response.data);
                if (response.status.name == "ok") {
                    $('#message').html("Updated location successfully");
                    $('#messageModal').modal('show');
                    generateDeptTable();
                }
                else {
                    alert("could not update");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("failed");
                console.log(errorThrown);
                console.log(jqXHR.responseText);
                console.log(textStatus);
            }
        });

    });




////loc update start
function updateLocation(details) {
    let id = details['id'];
    const locationName = details["name"];

    $('#updatelocname').val(locationName);

    /////


    /////
    $('#locupdateModal').modal('show');
    //get new values fro update modal and send to php for query on click of updateyes

    $('#updateLocYes').on("click", function () {

        let name = $('#updatelocname').val();

        console.log("updating ", name, id);
        $.ajax({
            url: './assets/dist/php/updateLocation.php',
            type: 'POST',
            data: {
                id: id,
                name: name,
            },
            success: (response) => {
                console.log("seacrch names result", response.data);
                if (response.status.name == "ok") {
                    $('#message').html("Updated location successfully");
                    $('#messageModal').modal('show');
                    generateLocTable();
                }
                else {
                    alert("could not update");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("failed");
                console.log(errorThrown);
                console.log(jqXHR.responseText);
                console.log(textStatus);
            }
        });

    });


}
///loc update end




function deleteFromPersonnel(details) {
    let id = details['id'];
    let n = null;
    n = details['firstName'];
    n += " ";
    n += details['lastName'];
    n += " ?";
    $('#alertMessageE').html("Do you Want to delete  personnel record of ");
    $('#deleteObjectE').html(n);
    $('#alertModalE').modal('show');

    $('#empdeleteYes').on('click', function () {
        //alert("delete"+details['firstname']+details['LastName']);
        $.ajax({
            url: './assets/dist/php/deletePersonnelByID.php',
            type: 'POST',
            data: {
                id: id
            },
            success: (response) => {


                generateEmpTable();


            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("id sent", id);
                console.log("failed");
                console.log(errorThrown);
                console.log(jqXHR.responseText);
                console.log(textStatus);
            }
        });
    });
}

function deleteFromDepartment(details) {

    let id = details['id'];
    let d = details['Department'];
    $('#alertMessageD').html("Do you Want to delete the Department record of");
    $('#deleteObjectD').html(d);
    $('#alertModalD').modal('show');

    $('#deptdeleteYes').on('click', function () {
        $.ajax({
            url: './assets/dist/php/deleteDepartmentByID.php',
            type: 'POST',
            data: {
                id: id
            },
            success: (response) => {

                if (response.data == -1) {
                    $('#message').html("Deptartment deleted Successfully");
                    $('#messageModal').modal('show');
                    generateDeptTable();
                }
                else {
                    console.log("dependents", response.data);
                    let m = "Cannot delete department, ";
                    m += response.data;
                    m += "  employees are attached to it.(First delete all attached employee )";
                    console.log(m);
                    $('#message').html(m);
                    $('#messageModal').modal('show');

                }

            },
            error: function (jqXHR, textStatus, errorThrown) {

                console.log(errorThrown);
                console.log(jqXHR.responseText);
                console.log(textStatus);
            }
        });

    });
}

function deleteFromLocation(details) {


    let id = details['id'];
    let d = details['name'];
    $('#alertMessageL').html("Do you Want to delete the Location record:");
    $('#deleteObjectL').html(d);
    $('#alertModalL').modal('show');

    $('#locdeleteYes').on('click', function () {
        $.ajax({
            url: './assets/dist/php/deleteLocationByID.php',
            type: 'POST',
            data: {
                id: id
            },
            success: (response) => {

                if (response.data == -1) {
                    $('#message').html("Location deleted");
                    $('#messageModal').modal('show');
                    generateLocTable();
                }
                else {
                    console.log("dependents", response.data);
                    let m = "Cannot delete location !! ";
                    m += response.data;
                    m += "  departments are attached to it.(First delete all attached departments)";
                    console.log(m);
                    $('#message').html(m);
                    $('#messageModal').modal('show');
                }

            },
            error: function (jqXHR, textStatus, errorThrown) {

                console.log("failed");
                console.log(errorThrown);
                console.log(jqXHR.responseText);
                console.log(textStatus);
            }
        });
    });

}

//     const tableDetails = [{ name: "testName1", email: "testEmail", dob: "mockDoB", id: "1" }, { name: "testName1", email: "testEmail", dob: "mockDoB", id: "2" }, { name: "testName1", email: "testEmail", dob: "mockDoB", id: "3" }];
//     const {
//         tableHeaders,
//         tableBody
//     } = generateRows(tableDetails, ['name', 'email', 'dob', 'custom']);
//     $('#employeeTable').append(tableHeaders);
//     $('#employeeTable').append(tableBody);
// });