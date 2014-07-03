/*global MozSmsFilter*/
$(function() {
  'use strict';

  /*
  function logObject(obj) {
    $("#response").append("<br> New Object: " + obj);
    Object.keys(obj).forEach(function (key) {
      $("#response").append("<br> " + key + ": " + obj[key]);
    });
  }
  */
  function logMsg(msg) {
    [
      'type', 'id', 'threadId', 'body', 'delivery', 'deliveryStatus', 'read'
    , 'receiver', 'sender', 'timestamp', 'messageClass'
    ].forEach(function (key) {
      $("#response").append("<br> " + key + ": " + msg[key]);
    });
  }

  $('form#sms-form').on("submit", function (ev) {
    $("#response").html("submit form");
    ev.preventDefault();
    ev.stopPropagation();

    var msg = $('[name=msg]').val()
      , phone = $('[name=phone]').val()
      , request
      //, requests
      ;

    $("#response").html("got values");

    request = navigator.mozMobileMessage.send(phone, msg);
    $("#response").html("tried to send message");

    //requests.forEach(function (request) {
    $("#response").html("iterate through requests");
    request.onsuccess = function () {
      window.thing = this;
      console.error(this.result);
      $("#response").html("Sent to <br>" + this.result);
      logMsg(this.result);
    };
    request.onerror = function () {
      window.thing = this;
      console.error(this.error.name);
      console.error(this.error.message);
      $("#response").html(this.error.name + ':' + this.error.message);
    };
    //});
  });

  function showMessages(id) {
    var filter = new MozSmsFilter() // https://developer.mozilla.org/en-US/docs/Web/API/MozSmsFilter
      , cursor
      ;

    filter.read = false;
    if ('undefined' !== typeof id) {
      filter.threadId = id;
    }

    // Get the messages from the latest to the first
    cursor = navigator.mozMobileMessage.getMessages(filter, true);

    cursor.onsuccess = function () {
      logMsg(this.result);
      /*
      var message = this.result
        , time = message.timestamp.toDateString()
        ;

      console.log(time + ': ' + (message.body || message.subject)); // SMS || MMS
      $("#response").append("<div>Got new message [" + time + "]"
        + "<br>" + (message.body || message.subject)
        + "</div>"
      );

      if (!this.done) {
        this.continue();
      }
      */
    };
  }

  // 'received' seems to only activate after a message is sent
  navigator.mozMobileMessage.addEventListener('received', function (msg) {
    // https://developer.mozilla.org/en-US/docs/Web/API/MozSmsMessage
    $("#response").html("Got a message");
    $("#response").append("<br>" + msg);
    logMsg(msg);

    showMessages(msg.id);
  });

  navigator.mozSetMessageHandler("alarm", function (mozAlarm) { 
    // var directive = alorms[mozAlarm.data.id]; doStuff(directive);
    $("#alarms").append("<li>Alarm Fired: " + new Date().toString().replace(/GMT.*/, ''));
      //+ " : " + JSON.stringify(mozAlarm.data) + "</li>");
    showMessages();
    //setAlarm(7 * 1000);
    setAlarm(7 * 60 * 1000);
  });
  
  function setAlarm(offset) {
    var alarmId
      , date
      , request
      ;

    $("#response").append("<br><br> setting alarm for " + (offset / 1000) + "s in the future");
    date = new Date(Date.now() + offset);
    $("#response").append("<br> will fire at " + " for " + date.toString().replace(/GMT.*/, ''));

    // Set an alarm and store it's id
    //request = navigator.mozAlarms.add(date, "ignoreTimezone", { foo: "bar" });
    request = navigator.mozAlarms.add(date, "honorTimezone", { foo: "bar" });

    request.onsuccess = function () {
      // alarms[this.result] = { type: 'thingy', params: ['do', 'stuff'] };
      alarmId = this.result;
      if (this.result) {
        $("#response").append("<br> set alarm " + this.result + " for " + date.toString().replace(/GMT.*/, ''));
      } else {
        $("#response").append("<br><br> error setting alarm: " + this.error);
      }
    };

    // ...

    // Later on, removing the alarm if it exists
    if (alarmId) {
      navigator.mozAlarms.remove(alarmId);
    }
  }

  if (!navigator.mozHasPendingMessage("alarm")) {
    setAlarm(5 * 1000);
  }
});
