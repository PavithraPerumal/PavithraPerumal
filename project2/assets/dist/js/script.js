// Table Header Creation
const generateHeader = (requiredTableColumns) => {
    let tableHeadersRows = "";
    requiredTableColumns.forEach(Column => {
        tableHeadersRows += `<th>${Column}</th>`
    });
    tableHeadersRows += `<th>Actions</th>`;
    return `<tr>${tableHeadersRows}</tr>`;
};

function onEdit(details, type) {
    console.log("Edit of type", details, type);
    if (type == "emp") {
        updatePersonnel(details);
    }
    else if (type == "dept") {
        updateDepartment(details);
    }
    else if (type == "loc") {
        updateLocation(details);
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
    button.setAttribute("class", "btn btn-sm btn-primary m-1 glyphicon glyphicon-pencil");
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
    //generate tables for all 3 tabs
    generateEmpTable();
    generateDeptTable();
    generateLocTable();
  
});
//refresh the tab on click of refresh button
$('#refreshE').on('click',function(){
    $('#employeeTable').empty();
    $('#departmentTable').empty();
    $('#locationTable').empty();
    generateEmpTable();
    generateDeptTable();
    generateLocTable()
})


$('#refreshD').on('click',function(){
    $('#employeeTable').empty();
    $('#departmentTable').empty();
    $('#locationTable').empty();
    generateEmpTable();
    generateDeptTable();
    generateLocTable();
})

//generate employee table
function generateEmpTable() {
    const type = "emp";
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
            console.log("failed");
            console.log(errorThrown);
            console.log(jqXHR.responseText);
            console.log(textStatus);
        }

    });

}
//generate department table data
function generateDeptTable() {
    const type = "dept";
    //console.log("generating dept table....");

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

//generate location table
function generateLocTable() {
    const type = "loc";
    //console.log("generating location table....");

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
$('#filterDeptBtn').on('click',function(){
    document.getElementById('filterDept').options.length = 0;
   
    $.ajax({
        url: './assets/dist/php/getAllDepartments.php',
        type: 'POST',
        success: (response) => {
            let departments = response.data.dept;
            let optiondv = `<option value="-1">---All Departments---</option>`;
            departments.forEach(d => {
                console.log(d.department);
                optiondv += `<option value=${d.id}>${d.Department}</option>`;
            });

            $("#filterDept").append(optiondv).select();

        },
        error: function (jqXHR, textStatus, errorThrown) {

            console.log("failed");
            console.log(errorThrown);
            console.log(jqXHR.responseText);
            console.log(textStatus);
        }
    });
    $('#deptfilterModal').modal('show');
})

$('#filterDept').on('change',function(){
    document.getElementById('employeeTable').length = 0;
    let deptID = $('#filterDept').val();
    let locID = $('#filterLoc').val();
    let searchStr=$('#nameToSearch').val();
    searchStr=searchStr.toUpperCase();
    console.log("search name",searchStr);
    if(deptID==null ){deptID=-1;}
    if(locID==null){locID=-1;}
    if(searchStr==""){searchStr=-1;}

    console.log("filters,search ",deptID,locID,searchStr);
    if(deptID=="-1" && locID=="-1"){
        generateEmpTable();
        return;
    }
    
    $.ajax({
        url: './assets/dist/php/filterDepartment.php',
        type: 'POST',
        data: {
            deptID: deptID,
            locID: locID,
            searchStr:searchStr
        },
        success: (response) => {
            console.log("search names result", response.data);
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
    
})//end filterdept


///filter employee by location


$('#filterLocBtn').on('click',function(){
    document.getElementById('filterLoc').options.length = 0;
       $.ajax({
        url: './assets/dist/php/getAllDepartments.php',
        type: 'POST',
        success: (response) => {
            let locations = response.data.loc;
            let optionlv = `<option value="-1">---All Locations---</option>`;
            locations.forEach(l => {
                console.log(l.name);
                optionlv += `<option value=${l.id}>${l.name}</option>`;
            });

            $("#filterLoc").append(optionlv).select();
            console.log(optionlv);

        },
        error: function (jqXHR, textStatus, errorThrown) {

            console.log("failed");
            console.log(errorThrown);
            console.log(jqXHR.responseText);
            console.log(textStatus);
        }
    });
    $('#locfilterModal').modal('show');
})

$('#filterLoc').on('change',function(){
    document.getElementById('employeeTable').length = 0;
    let deptID = $('#filterDept').val();
    let locID = $('#filterLoc').val();
    let searchStr=$('#nameToSearch').val();
    searchStr=searchStr.toUpperCase();
    console.log("search name",searchStr);
    if(deptID==null ){deptID=-1;}
    if(locID==null){locID=-1;}
    if(searchStr==""){searchStr=-1;}


    if(locID=="-1" && locID=="-1"){
        generateEmpTable();
        return;
    }
    
    $.ajax({
        url: './assets/dist/php/filterLocation.php',
        type: 'POST',
        data: {
            locID: locID,
            deptID: deptID,
            searchStr:searchStr
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
    
})//end filter location

///////////////Insert////////////////
////////populatedept select drop down
$('#empInsertBtn').on('click', function () {

    document.getElementById('inputDept').options.length = 0;
    $.ajax({
        url: './assets/dist/php/getAllDepartments.php',
        type: 'POST',
        success: (response) => {
            let departments = response.data.dept;
            let optiondv ;//= `<option value=""></option>`;
            departments.forEach(d => {
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
   
///department insert
$('#deptInsertBtn').on('click', function () {
    document.getElementById('inputLocation').options.length = 0;
    $.ajax({
        url: './assets/dist/php/getAllDepartments.php',
        type: 'POST',
        success: (response) => {
            let locations = response.data.loc;
            let optionlv;// = `<option value=""></option>`;
            locations.forEach(l => {
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
            if (response.data == 0) {
               
                generateLocTable();
            }
            else{
                $('#message').html("Location already exists! ");
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
        let lname = $('#inputLN').val();
        let email = $('#inputEmail').val();
        let departmentID = $('#inputDept').val();
        let jobTitle=$('#inputJob').val();
    
        
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
                jobTitle:jobTitle
            },
            success: (response) => {
                if (response.data == 0) {
                   
                    generateEmpTable();
                   
                }
                else{
                    $('#message').html("cannot insert, email id exisits !");
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
        document.getElementById("empInsertForm").reset();
})

    
///dept inserting

$("#deptInsertForm").submit(function(event) {

    event.preventDefault();
    $('#deptInsertModal').modal('hide');
    let name = $('#deptName').val();
    let locID = $('#inputLocation').val();
    $.ajax({
        url: './assets/dist/php/insertDepartment.php',
        type: 'POST',
        data: {
            name: name,
            locID: locID,

        },
        success: (response) => {
            if (response.data == 0) {
                generateDeptTable();
            }
            else{
                $('#message').html("Department already exists! ");
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

    document.getElementById("deptInsertForm").reset();

})

//////////searching ///////////
//personnel search
$('#nameToSearch').on("keyup", function (event) {
    
    let dfilter=$('#filterDept').val();
    let lfilter=$('#filterLoc').val();
    console.log("filters ",dfilter,lfilter);
    if(dfilter==null){dfilter=-1};
    if(lfilter==null){lfilter=-1};
    console.log("filters ",dfilter,lfilter);
    document.getElementById('employeeTable').length = 0;
    let s = $(this).val();
    if(s!=null){

        let search = s.toUpperCase();
        $.ajax({
        url: './assets/dist/php/searchAll.php',
        type: 'POST',
        data: {
            search: search,
            dfilter: dfilter,
            lfilter: lfilter
        },
        success: (response) => {
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
    }
else{

    generateEmpTable();
}
})

//////searching dept
$('#deptToSearch').on('keyup', function () {
    let s = $(this).val();
   // let filt=$('#filterDept').val();
    let search = s.toUpperCase();
    if(search!==null){
    
    $.ajax({
        url: './assets/dist/php/searchDept.php',
        type: 'POST',
        data: {
            search: search
        },
        success: (response) => {
            let tableDetails = response.data;
            const {
                tableHeaders,
                tableBody
            } = generateTable(tableDetails, ['Department', 'Location'],type = "dept");
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
    
}
else{
    generateDeptTable();
}
})

//////////updating////////////
//////updating personnel names,email
function updatePersonnel(details) {
    console.log("details",details);
    let id = details['id'];
    let fname = details['firstName'];
    let lname = details['lastName'];
    let email = details['email'];
    let jobTitle = details['jobTitle'];
    let department = details['dID'];
    let deptname=details['department'];
    deptname+="(current)";
    $('#updateFN').val(fname);
    $('#updateLN').val(lname);
    $('#updateEmail').val(email);
    $('#updateJob').val(jobTitle);
    
    document.getElementById('updateDept').options.length = 0;
 
    $.ajax({
        url: './assets/dist/php/getAllDepartments.php',
        type: 'POST',
        success: (response) => {
            let departments = response.data.dept;
            let optiondv;// = `<option value=department>${deptname}</option>`;//set to current dept
            departments.forEach(d => {
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
    $('#empUpdateModal').modal('show');


    $('#empUpdateYes').on('click', function () {

        $('#empUpdateModal').modal('hide');
       // let deptid = document.getElementById('updateDept').value;
        let deptid=$('#updateDept').val();
        fname = $('#updateFN').val();
        lname = $('#updateLN').val();
        email = $('#updateEmail').val();
        jobTitle = $('#updateJob').val();
        console.log(/^[A-z],[A-z0-9'\x22\s]{1,20}$/.test(fname));
        if(fname=="" ||lname=="" ||email=="" ||deptid==""){
            $('#message').html("Cannot update to null values");
            $('#messageModal').modal('show');
        }
        else if(!fname.match("^[A-zÀ-ž][A-zÀ-ž0-9'\x22\s]{1,20}$") || !lname.match("^[A-zÀ-ž][A-zÀ-ž0-9'\x22\s]{1,20}$")){
           
            $('#message').html("Cannot update! Name contains invalid characters");
            $('#messageModal').modal('show');
        }
        else if(!email.match("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")){
            $('#message').html("Cannot update! Email id is of invalid format");
            $('#messageModal').modal('show');
        }
        else{
        $.ajax({
            url: './assets/dist/php/updatePersonnel.php',
            type: 'POST',
            data: {
                id: id,
                fname: fname,
                lname: lname,
                email: email,
                departmentID: deptid,
                jobTitle: jobTitle
            },
            success: (response) => {
                if (response.data == 0) {
                    $('#message').html("Updated employee successfully");
                    $('#messageModal').modal('show');
                    generateEmpTable();
                    generateDeptTable();
                    generateLocTable();
                }
                else {
                    $('#message').html("cannot update! Employee email ID already exists.");
                    $('#messageModal').modal('show');
                    generateEmpTable();
                    generateDeptTable();
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
    }
    });//onclickend

}


///update department
function updateDepartment(details) {
    let id = details['id'];
    const Department = details["Department"];
    const Location = details["lID"];
    $('#updatedeptname').val(Department);
    $('#currentLocation').val(Location);
  
    document.getElementById('updateNewLocation').options.length = 0;
    $.ajax({
        url: './assets/dist/php/getAllDepartments.php',
        type: 'POST',
        success: (response) => {
            let locations = response.data.loc;
            let optionlv;// = `<option value=""></option>`;
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
    //get new values from update modal and send to php for query on click of #updateyes

    $('#updateYes').on("click", function () {
        $('#deptUpdateModal').modal('hide');
        let name = $('#updatedeptname').val();
        let locationID = document.getElementById('updateNewLocation').value;
       
        if(name=="" ||locationID==null){
            $('#message').html("Cannot update to null values");
            $('#messageModal').modal('show');
        }
        else if(!name.match("[a-zA-Z]{1,20}$")){
            $('#message').html("Cannot update! Department contains invalid characters");
            $('#messageModal').modal('show');
        }
        else{
        $.ajax({
            url: './assets/dist/php/updateDepartment.php',
            type: 'POST',
            data: {
                id: id,
                name: name,
                locationID: locationID
            },
            success: (response) => {
                if (response.data == 0) {
                    $('#message').html("Updated department successfully");
                    $('#messageModal').modal('show');
                    generateEmpTable();
                    generateDeptTable();
                    generateLocTable();
                }
                else {
                    $('#message').html("cannot update! Department already exists.");
                    $('#messageModal').modal('show');
                    generateEmpTable();
                    generateDeptTable();
                    generateLocTable();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("failed dept update");
                console.log(errorThrown);
                console.log(jqXHR.responseText);
                console.log(textStatus);
            }
        });
    }
    });


}

////loc update start
function updateLocation(details) {
    let id = details['id'];
    const locationName = details["name"];

    $('#updatelocname').val(locationName);

    $('#locupdateModal').modal('show');
    //get new values fro update modal and send to php for query on click of updateyes

    $('#updateLocYes').on("click", function () {
        $('#locupdateModal').modal('hide');
        let name = $('#updatelocname').val();

        console.log("updating ", name, id);
        if(name==""){
            $('#message').html("Cannot update to null values");
            $('#messageModal').modal('show');
        }
        else if(!name.match("[a-zA-Z]{1,20}$")){
            $('#message').html("Cannot update! Location name contains invalid characters");
            $('#messageModal').modal('show');
        }
        else{
        $.ajax({
            url: './assets/dist/php/updateLocation.php',
            type: 'POST',
            data: {
                id: id,
                name: name,
            },
            success: (response) => {
                console.log("seacrch names result", response.data);
                if (response.data == 0) {
                    $('#message').html("Updated location successfully");
                    $('#messageModal').modal('show');
                    generateEmpTable();
                    generateDeptTable();
                    generateLocTable();
                }
                else {
                    $('#message').html("cannot update! Location already exists.");
                    $('#messageModal').modal('show');
                    generateEmpTable();
                    generateDeptTable();
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
    }

    });


}
///loc update end

/////////delete/////////////////
function deleteFromPersonnel(details) {
    let id = details['id'];
    let n = null;
    n = details['firstName'];
    n += " ";
    n += details['lastName'];
    n += " ?";
    $('#alertMessageE').html("Do you want to delete  personnel record of ");
    $('#deleteObjectE').html(n);
    $('#alertModalE').modal('show');
    console.log("del emp : ",id);
    $('#empdeleteYes').on('click', function () {
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
///delete department
function deleteFromDepartment(details) {
    let id = details['id'];
    let d = details['Department'];
    
    $.ajax({
        url: './assets/dist/php/deleteDepartmentDependencyCheck.php',
        type: 'POST',
        data: {
            id: id
        },
        success: (response) => {

            if (response.data == 0) {
               $('#alertMessageD').html("Do you want to delete the Department record of");
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
                                $('#message').html("Department deleted Successfully");
                                $('#messageModal').modal('show');
                                generateDeptTable();
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
        
            else {
                let m = "Cannot delete department, ";
                m += response.data;
                m += "  employee(s) are attached to it. First delete all attached employee(s)";
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
    
}


function deleteFromLocation(details) {
    let id = details['id'];
    let d = details['name'];
    
    $.ajax({
        url: './assets/dist/php/deleteLocationDependencyCheck.php',
        type: 'POST',
        data: {
            id: id
        },
        success: (response) => {

            if (response.data == 0) {
               $('#alertMessageL').html("Do you want to delete the Location record of");
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
                                $('#message').html("Location deleted Successfully");
                                $('#messageModal').modal('show');
                                generateLocTable();
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
        
            else {
                let m = "Cannot delete Location, ";
                m += response.data;
                m += "  location(s) are attached to it. First delete all attached department(s)";
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
    
}