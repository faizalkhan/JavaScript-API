const baseURL = "http://localhost:5000/api";

token = "Bearer 123";

let itemsArray = [];


function getList() {
  fetch(`${baseURL}/list`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      
       itemsArray = data;
      console.log(data);
      renderUL()
    });
}

function renderUL()
{

    const ul = document.getElementById("items");
    ul.innerHTML = "";

    // const li = document.createElement("li");

    // ul.innerHTML = "";


    console.log("itemsArray 35", itemsArray);

debugger
    itemsArray.forEach((item) => {
        
       const li = document.createElement("li");
       li.id = `item-${item.id}`;
       li.classList = "flex text-lg justify-between bg-gray-100 p-1 rounded-lg px-5 mt-2";
       li.innerHTML = `
       <p class="w-full pr-5">
       <input readonly placeholder="Enter something..." class="w-full py-2 bg-transparent ring-0 outline outline-0" type="text" value="${item.value}">
       </p>
       <div class="gap-5 flex">
           <button onclick="toggleEditSave(${item.id})" id="editBtn${item.id}">Edit</button>
           <button onclick="deleteItem(${item.id})">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                   stroke="currentColor" class="w-6 h-6">
                   <path stroke-linecap="round" stroke-linejoin="round"
                       d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
               </svg>
           </button>
       </div>
       `;

       ul.appendChild(li)

    });

}

getList();


function toggleEditSave(id) 
{
    const input = document.getElementById(`item-${id}`).querySelector('input');

    console.log(input);

    if (input.readOnly) {
        editItem(id);
      } else {
        saveItem(id);
      }
}

function editItem(id) {
    const input = document.getElementById(`item-${id}`).querySelector("input");
    const editBtn = document.getElementById(`editBtn${id}`);
    input.readOnly = false;
    editBtn.textContent = "Save";
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
}


function saveItem(id) {
  debugger;
  const input = document.getElementById(`item-${id}`).querySelector("input");
  const editBtn = document.getElementById(`editBtn${id}`);
  input.readOnly = true;
  editBtn.textContent = "Edit";
  const itemToUpdate = itemsArray.find((x) =>  parseInt(x.id) === id);



   const oldValue = itemsArray[0].value;

   itemToUpdate.value = input.value;

   fetch(`${baseURL}/list/${id}`, {

     method : "PUT",
     headers : {
      Authorization : token,
      "Content-Type": "application/json",
     },
    body : JSON.stringify(itemToUpdate)
   })
   .then((response) => {

    if(!response.ok)
    {
      debugger;
      itemToUpdate.value = oldValue;
      console.log("response OK");
    }
     
   })
   .catch((error) => {
    itemToUpdate.value = oldValue;

    console.log("response catch" +  error.message);
  })
  .finally(() => {
    renderUL();
  })

  console.log(itemToUpdate);
}

function deleteItem(id)
{

  fetch(`${baseURL}/list/${id}`,{

    method : 'DELETE',
    headers :{
      Authentication : token,
      "Content-Type": "application/json",
    }

  }).then(() => {

     debugger;
     itemsArray =  itemsArray.filter((x) =>  parseInt(x.id) !== id);

  }).catch(() => {})
  .finally(() => {
    renderUL();
  });;

}


function addItems()
{
  debugger;
  const newItem = { value: "" }

  fetch(`${baseURL}/list/`, {
    method : "POST",
    headers :{
      Authorization : token,
      "Content-Type": "application/json",
    },
    body : JSON.stringify(newItem)
  }).then((res) => { 

      if(res.ok)
      {
        return res.json();
      }

  }).then((data) => {
    itemsArray =  data;    

    console.log(itemsArray);
  }).catch(() => {})
  .finally(() => {
    renderUL();
  })

}

