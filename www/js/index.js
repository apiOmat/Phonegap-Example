/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {        
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {        
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
        app.signup();
    },

    
 
    signup: function()
    {
      var statusField = document.getElementById("status");        
       var user = new Apiomat.User();
       user.setUserName("_username_");
       user.setPassword("_password_");
       Apiomat.Datastore.configure(user);
     
       var saveCB = {
         onOk: function() {
           statusField.innerHTML = "Saved user successfully";
           app.loadTasks();
         },
         onError: function(error) {
		   console.error(error);
           statusField.innerHTML = "Some error occured. "+ error.statusCode + " --> " + error.message;
         }
       };
       user.loadMe({
         onOk: function() {
           statusField.innerHTML = "Succefully logged in";
           app.loadTasks();
         },
         onError: function(error) {
           statusField.innerHTML= "No user there. Will create new one...";
		   console.error(error);
           user.save(saveCB);
         }
       });
    },
     
    addNewTask: function()
    {
         /* create a new task object */
          var task = new Apiomat.Task();
          task.setDescription("A new task");
          task.setDone(0);
          /* save the task object and on callback add to html table */
          task.save({
            onOk: function() {
              app.addToTable(task);
            },
            onError: function(error) {
              status.innerHTML = "Some error occured. "+ error.statusCode + " --> " + error.message;
            }
          });    
    },
     
    addToTable: function(task)
    {
      var table=document.getElementById("tasks");
      var row=table.insertRow(1);
      var cell1=row.insertCell(0);
      var cell2=row.insertCell(1);
      var cell3=row.insertCell(2);
      var cb = document.createElement("input");
      cb.setAttribute("type", "checkbox");
      cb.setAttribute("name", "isDone_" + task.getHref());
      cb.setAttribute("value", "");
      cb.checked = task.getDone() === 0? false: true;
      cell1.appendChild(cb);
      cell2.innerHTML=task.getDescription();
      var retDate = task.getUntilDate();
      cell3.innerHTML= retDate || 'not set';
    },
     
    loadTasks : function()
    {
        Apiomat.Task.getTasks(undefined, {
            onOk: function(tasks) {
              for (var i=0; i < tasks.length;i++) {
                app.addToTable(tasks[i]);
              }
            },
            onError: function(error) {
              status.innerHTML = "Can't load list: "+ error.statusCode + " --> " + error.message;
            }
        });     
    }
};
