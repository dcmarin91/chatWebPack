import "./style.css";
document.addEventListener("DOMContentLoaded", () => { 
  
  
    // Guardando la variable global    
      let saveUser = document.querySelector('#save-user');
      let inputName = document.querySelector('#user-name'); 
      saveUser.addEventListener("click", () => {       
        localStorage.setItem("userName", inputName.value);
        //console.log(localStorage.userName);  
        let modal = document.getElementById('login');
        modal.style.display = "none";
        requestFbLive();
        checkId();
        requestUserFbLive();
      });
      
    
      // Firebase Script
      var firebaseConfig = {
        apiKey: "AIzaSyCOUcDSSOibf46hFGwx093i6bq-UJ6zCXk",
        authDomain: "chatfirebase-df340.firebaseapp.com",
        databaseURL: "https://chatfirebase-df340.firebaseio.com",
        projectId: "chatfirebase-df340",
        storageBucket: "chatfirebase-df340.appspot.com",
        messagingSenderId: "823623127299",
        appId: "1:823623127299:web:0066af1f9e08361a"
      };
    
        firebase.initializeApp(firebaseConfig);
        let db = firebase.firestore();
      //
      

      // Esta funcion crea una nueva clase Chat y la agrega en la seccion Window. Se usa en el requestFBLive
      const writer = (person) => {
        let newChat = document.createElement('div');
          newChat.classList.add("chats");
          
          newChat.innerHTML = `<h3>${person.name}</h3><span>${person.date}</span><p>${person.body}</p>`;
    
          let windows = document.querySelector(".window");
          windows.appendChild(newChat);
      }


      // Carga los mensajes que haya en la base de datos en tiempo real y por medio de writer escribe los chats
      const requestFbLive = () => {
        db.collection("messages").orderBy("date", "asc")
          .onSnapshot(snapshot => {
          snapshot.docChanges().forEach(change => {
            if (change.type === "added") {
              let dataFb = change.doc.data();
              writer(dataFb);
            }
          });
        });
      }

      //Verifica que se haya presionado enter en el texto y llama la funcion addMsg para escribir el mensaje
      const newMsg = () => {
        let inputMsg = document.querySelector("#chatInput");  
        inputMsg.addEventListener("keydown", (event) => {
          if (event.key === "Enter") { 
            addMsg();
            //autoScroll();
          }
        });
      }


      //Anade el mensaje escrito en el textbox al chat
      const addMsg = () => {
        let inputText = document.querySelector("#chatInput");
        let person = {name: localStorage.userName, date: dateNow(), body: inputText.value}; 
        sendFB(person);
        inputText.value = " ";        
      }

      //Configura la fecha en el formato deseado
      const dateNow = () => {
        let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        let d = new Date;
        let month = months[d.getMonth()]; 
        let day = d.getDate();
        let hour = d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
        let fecha = month.concat(" ",day," ",hour);
        return fecha;
      }


      // Envia el mensaje que se escribio en el chat a la Base de datos
      const sendFB = (person) => {
        db.collection("messages").add({
        name: person.name,
        date: person.date,
        body: person.body
        })
      }

      const sendUserFB = () =>{
        console.log(localStorage.userName);
        db.collection('usuarios').add({
          user: localStorage.userName
        })
      }
      
      const findbyID = () =>(
        db.collection("usuarios").where("user", "==", localStorage.userName)
        .get().then((snapshot =>{
          
          if (snapshot.empty) {
            return(false);
          }else{
            return(true);
          } 
        }))
      )

      const checkId = () =>(
        findbyID()
        .then(value =>{
          if(!value){
            sendUserFB();
          }else{
            console.log("Ya el nombre existe")
          }
        })
      )


      /*    
      const autoScroll = () => {
        let windowChat = document.querySelector(".window")
        windowChat.scrollBy(0, 100); 
      }

      */
      const userSelect = () => {
        console.log(localStorage.userName)
        
        
        document.addEventListener("click", () => {
          console.log(`#${localStorage.userName}`)
          let user4 = document.querySelector(`${localStorage.userName}`);
          console.log(user4)
          //requestFbLive();
        })
        
      }
      
    
      const writerUser = (person) => {
        let newUser = document.createElement('li');
          
          newUser.innerHTML = 
          `<div id="${person.user}" class="users">
            <i class="fas fa-circle"></i>
            <span>${person.user}</span>
            <i class="fas fa-ellipsis-v"></i>
          </div>`;
    
          let sideBar = document.querySelector("ul");
          sideBar.appendChild(newUser);
      }
      
      function requestUserFbLive(){
        db.collection("usuarios")
          .onSnapshot(snapshot => {
          snapshot.docChanges().forEach(change => {
            if (change.type === "added") {
              let dataFb = change.doc.data();
              writerUser(dataFb);
            }
          });
        });
      }
      

      
      const bindEvents = () => {
        userSelect();
        newMsg();
      }
    
      bindEvents();  

     //newMsg();
    });
    // FIN DEL CODIGO
    
    