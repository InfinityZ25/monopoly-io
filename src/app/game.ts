import {Trade} from "./trade";
import * as $ from "jquery";

export class Game {

  square = [];
  player = [];
  turn: any;

  die1: any;
  die2: any;
  areDiceRolled = false;

  auctionQueue = [];
  highestbidder: any;
  highestbid: any;
  currentbidder = 1;
  auctionproperty: any;

  // Trade functions:

  currentInitiator : any;
  currentRecipient : any;


  available_colors: ['blue', 'red', 'green', 'yellow', 'aqua', 'black', 'fuchsia', 'gray', 'lime', 'maroon', 'navy', 'olive', 'orange', 'purple', 'silver', 'teal'];

  arr_diff(a1, a2) {
    var a = [], diff = [];

    for (var i = 0; i < a1.length; i++) {
      a[a1[i]] = true;
    }

    for (var i = 0; i < a2.length; i++) {
      if (a[a2[i]]) {
        delete a[a2[i]];
      } else {
        a[a2[i]] = true;
      }
    }

    for (var k in a) {
      diff.push(k);
    }

    return diff;
  };

  // Overwrite an array with numbers from one to the array's length in a random order.
  randomize(arr, length) {
      length = (length || arr.length);
      var num;
      var indexArray = [];

      for (var i = 0; i < length; i++) {
        indexArray[i] = i;
      }

      for (var i = 0; i < length; i++) {
        // Generate random number between 0 and indexArray.length - 1.
        num = Math.floor(Math.random() * indexArray.length);
        this[i] = indexArray[num] + 1;

        indexArray.splice(num, 1);
      }
  }

  draw_setup = function () {
    //var context = this._draw_setup;

    this.draw_player_wrappers(8);
    this.bind_player_inteligence_change();
    this.bind_and_invoke_player_color_change();
    this.bind_and_invoke_players_count_change();
  }

  //_draw_setup = {}

  draw_player_wrappers = function (max) {
  var i, color;

  var content = "";

  var content_intel = "";
  content_intel += "<select class='player-intel' title='Choose whether this player is controled by a human or by the computer.'>";
  content_intel += "	<option value='0' selected='selected'>Human</option>";
  content_intel += "	<option value='1'>AI (Test)</option>";
  content_intel += "</select>";

  var content_colors = "<select class='player-color' title='Player color'>";
  for (i = 0; i <= this.available_colors.length - 1; i++) {
    color = this.available_colors[i];
    content_colors += "<option style='color: " + color + ";'>" + color + "</option>";
  }
  ;
  content_colors += "</select>";

  for (i = 1; i <= max; i++) {
    content += "<div id='player" + i + "wrap' data-id='" + i + "' class='player-wrap'>";
    content += "Player " + i + ": ";
    content += "<input type='text' class='player-name' title='Player name' maxlength='16' value='Player " + i + "' /> ";
    content += content_colors;
    content += " ";
    content += content_intel;
    content += "</div>";
  }
  ;

  $("#player-wrappers").append(content);
}

  _bind_player_inteligence_change = function () {
  $("#player-wrappers .player-intel").change(function () {
    var val = $(this).val();
    var boo = val !== '0';
    var wrap = $(this).closest('.player-wrap');

    wrap.find('.player-name').attr('disabled', String(boo));
    wrap.nextAll().find('.player-name').attr('disabled', String(boo));
    wrap.nextAll().find('.player-intel').val(val);
  });
}

  bind_and_invoke_player_color_change = function () {
  $("#player-wrappers .player-color").on("change", this._draw_setup.select_on_player_color_change);
  $("#player-wrappers .player-color").change();
}

  bind_and_invoke_players_count_change = function () {
  $("#playernumber").on("change", this._draw_setup.select_on_player_number_change);
  $("#playernumber").change();
}


  select_on_player_number_change = function () {
  this.pcount = 4; //TODO: Update so user can set the number of players

  $(".player-wrap").hide();

  for (var i = 1; i <= this.pcount; i++) {
    $("#player" + i + "wrap").show();
  }
}

  select_on_player_color_change = function () {
  var colors_taken = [];

  var wrap = $(this).closest('.player-wrap');

  // assume current and before as static
  colors_taken.push($(this).val());

  var self = this;
  // change any next to any other color
  wrap.siblings().each(function (index, el) {
    var el2 = $(el).find('.player-color');
    var val2 = el2.val();
    var is_already_present = colors_taken.indexOf(val2) != -1;
    if (is_already_present) {
      // change its color to next available
      var colors_not_taken = self.arr_diff(self.available_colors, colors_taken);
      el2.val(colors_not_taken[0]);
    }

    // refresh val2
    val2 = el2.val();
    colors_taken.push(val2);

  });

}

  setup = function () {

      this.pcount = 4; //TODO: Should be set by the user

      var playerArray = new Array(this.pcount);
      var p, wrap, intel;

      //playerArray.randomize();
      this.randomize(playerArray,null);

      for (var i = 1; i <= this.pcount; i++) {
        p = this.player[playerArray[i - 1]];

        wrap = $("div#player" + i + "wrap");
        intel = wrap.find("select.player-intel").val();

        p.color = wrap.find("select.player-color").val().toLowerCase();

        if (intel === "0") {
          p.name = wrap.find("input.player-name").val();
          p.human = true;
        } else {
          p.human = false;
          //p.AI = new AITest(p);
        }
      }

      $("#board, #moneybar").show();
      $("#setup").hide();

      if (this.pcount === 2) {
        document.getElementById("stats").style.width = "454px";
      } else if (this.pcount === 3) {
        document.getElementById("stats").style.width = "686px";
      }

      document.getElementById("stats").style.top = "0px";
      document.getElementById("stats").style.left = "0px";

      this.play();
  }

  rollDice = function() {
    this.die1 = Math.floor(Math.random() * 6) + 1;
    this.die2 = Math.floor(Math.random() * 6) + 1;
    this.areDiceRolled = true;
  };

  resetDice = function() {
    this.areDiceRolled = false;
  };

  next = function() {
    var p = this.player[this.turn];

    if (!p.human && p.money < 0) {
      p.AI.payDebt();

      if (p.money < 0) {
        this.popup("<p>" + p.name + " is bankrupt. All of its assets will be turned over to " + this.player[p.creditor].name + ".</p>", this.game.bankruptcy);
      } else {
        this.roll();
      }
    } else if (this.areDiceRolled && this.doublecount === 0) {
      this.play();
    } else {
      this.roll();
    }
  };

  getDie = function(die) {
    if (die === 1) {

      return this.die1;
    } else {

      return this.die2;
    }

  };

  // Auction functions:

  finalizeAuction = function() {
    var p = this.player[this.highestbidder];
    var sq = this.square[this.auctionproperty];

    if (this.highestbid > 0) {
      p.pay(this.highestbid, 0);
      sq.owner = this.highestbidder;
      this.addAlert(p.name + " bought " + sq.name + " for $" + this.highestbid + ".");
    }

    for (var i = 1; i <= this.pcount; i++) {
      this.player[i].bidding = true;
    }

    $("#popupbackground").hide();
    $("#popupwrap").hide();

    if (!this.game.auction()) {
      this.play();
    }
  };

  addPropertyToAuctionQueue = function(propertyIndex) {
    this.auctionQueue.push(propertyIndex);
  };

  auction = function() {
    if (this.auctionQueue.length === 0) {
      return false;
    }

    var index = this.auctionQueue.shift();

    var s = this.square[index];

    if (s.price === 0 || s.owner !== 0) {
      return this.game.auction();
    }

    this.auctionproperty = index;
    this.highestbidder = 0;
    this.highestbid = 0;
    this.currentbidder = this.turn + 1;

    if (this.currentbidder > this.pcount) {
      this.currentbidder -= this.pcount;
    }

    this.popup("<div style='font-weight: bold; font-size: 16px; margin-bottom: 10px;'>Auction <span id='propertyname'></span></div><div>Highest Bid = $<span id='this.highestbid'></span> (<span id='this.highestbidder'></span>)</div><div><span id='this.currentbidder'></span>, it is your turn to bid.</div><div><input id='bid' title='Enter an amount to bid on " + s.name + ".' style='width: 291px;' /></div><div><input type='button' value='Bid' onclick='game.auctionBid();' title='Place your bid.' /><input type='button' value='Pass' title='Skip bidding this time.' onclick='game.auctionPass();' /><input type='button' value='Exit Auction' title='Stop bidding on " + s.name + " altogether.' onclick='if (confirm(\"Are you sure you want to stop bidding on this property altogether?\")) game.auctionExit();' /></div>", "blank");

    document.getElementById("propertyname").innerHTML = "<a href='javascript:void(0);' onmouseover='showdeed(" + this.auctionproperty + ");' onmouseout='hidedeed();' class='statscellcolor'>" + s.name + "</a>";
    document.getElementById("this.highestbid").innerHTML = "0";
    document.getElementById("highestbidder").innerHTML = "N/A";
    document.getElementById("this.currentbidder").innerHTML = this.player[this.currentbidder].name;
    document.getElementById("bid").onkeydown = (ev: KeyboardEvent): any => {
      //document.getElementById("bid").onkeydown = function (e) {
        var key = 0;
        var isCtrl = false;
        var isShift = false;

        if (window.event) {
          key = ev.charCode;
          isCtrl = ev.ctrlKey;
          isShift = ev.shiftKey;
        } else if (ev) {
          key = ev.keyCode;
          isCtrl = ev.ctrlKey;
          isShift = ev.shiftKey;
        }

        if (isNaN(key)) {
          return true;
        }

        if (key === 13) {
          this.game.auctionBid();
          return false;
        }

        // Allow backspace, tab, delete, arrow keys, or if control was pressed, respectively.
        if (key === 8 || key === 9 || key === 46 || (key >= 35 && key <= 40) || isCtrl) {
          return true;
        }

        if (isShift) {
          return false;
        }

        // Only allow number keys.
        return (key >= 48 && key <= 57) || (key >= 96 && key <= 105);
      //};

    }


    document.getElementById("bid").onfocus = function () {
      this.style.color = "black";
      if (isNaN(parseInt((<HTMLInputElement>this).value))) {
        (<HTMLInputElement>this).value = "";
      }
    };

    this.updateMoney();

    if (!this.player[this.currentbidder].human) {
      this.currentbidder = this.turn; // auctionPass advances this.currentbidder.
      this.auctionPass();
    }
    return true;
  };

  auctionPass = function() {
    if (this.highestbidder === 0) {
      this.highestbidder = this.currentbidder;
    }

    while (true) {
      this.currentbidder++;

      if (this.currentbidder > this.pcount) {
        this.currentbidder -= this.pcount;
      }

      if (this.currentbidder == this.highestbidder) {
        this.finalizeAuction();
        return;
      } else if (this.player[this.currentbidder].bidding) {
        var p = this.player[this.currentbidder];

        if (!p.human) {
          var bid = p.AI.bid(this.auctionproperty, this.highestbid);

          if (bid === -1 || this.highestbid >= p.money) {
            p.bidding = false;

            window.alert(p.name + " exited the auction.");
            continue;

          } else if (bid === 0) {
            window.alert(p.name + " passed.");
            continue;

          } else if (bid > 0) {
            this.auctionBid(bid);
            window.alert(p.name + " bid $" + bid + ".");
            continue;
          }
          return;
        } else {
          break;
        }
      }

    }

    document.getElementById("this.currentbidder").innerHTML = this.player[this.currentbidder].name;
    (<HTMLInputElement>document.getElementById("bid")).value = "";
    document.getElementById("bid").style.color = "black";
  };

  auctionBid = function(bid) {

    bid = bid || parseInt((<HTMLInputElement>document.getElementById("bid")).value, 10);

    if (bid === "" || bid === null) {
      (<HTMLInputElement>document.getElementById("bid")).value = "Please enter a bid.";

      document.getElementById("bid").style.color = "red";
    } else if (isNaN(bid)) {
      (<HTMLInputElement>document.getElementById("bid")).value = "Your bid must be a number.";
      document.getElementById("bid").style.color = "red";
    } else {

      if (bid > this.player[this.currentbidder].money) {
        (<HTMLInputElement>document.getElementById("bid")).value = "You don't have enough money to bid $" + bid + ".";
        document.getElementById("bid").style.color = "red";
      } else if (bid > this.highestbid) {
        this.highestbid = bid;

        //(<HTMLInputElement>document.getElementById("highestbid")).innerHTML = parseInt(bid, 10);
        (<HTMLInputElement>document.getElementById("highestbid")).innerHTML = bid;

        this.highestbidder = this.currentbidder;
        document.getElementById("highestbidder").innerHTML = this.player[this.highestbidder].name;

        document.getElementById("bid").focus();

        if (this.player[this.currentbidder].human) {
          this.auctionPass();
        }
      } else {
        (<HTMLInputElement>document.getElementById("bid")).value = "Your bid must be greater than highest bid. ($" + this.highestbid + ")";
        document.getElementById("bid").style.color = "red";
      }
    }
  };

  auctionExit = function() {
    this.player[this.currentbidder].bidding = false;
    this.auctionPass();
  };

  // Trade functions:

  // Define event handlers:

  tradeMoneyOnKeyDown = function (e) {
    var key = 0;
    var isCtrl = false;
    var isShift = false;

    if (window.event) {
      //key = window.event.keyCode;
      //isCtrl = window.event.ctrlKey;
      //isShift = window.event.shiftKey;
    } else if (e) {
      key = e.keyCode;
      isCtrl = e.ctrlKey;
      isShift = e.shiftKey;
    }

    if (isNaN(key)) {
      return true;
    }

    if (key === 13) {
      return false;
    }

    // Allow backspace, tab, delete, arrow keys, or if control was pressed, respectively.
    if (key === 8 || key === 9 || key === 46 || (key >= 35 && key <= 40) || isCtrl) {
      return true;
    }

    if (isShift) {
      return false;
    }

    // Only allow number keys.
    return (key >= 48 && key <= 57) || (key >= 96 && key <= 105);
  };

  tradeMoneyOnFocus = function () {
    this.style.color = "black";
    if (isNaN(this.value) || this.value === "0") {
      this.value = "";
    }
  };

  tradeMoneyOnChange = function(e) {
    $("#proposetradebutton").show();
    $("#canceltradebutton").show();
    $("#accepttradebutton").hide();
    $("#rejecttradebutton").hide();

    var amount = this.value;

    if (isNaN(amount)) {
      this.value = "This value must be a number.";
      this.style.color = "red";
      return false;
    }

    amount = Math.round(amount) || 0;
    this.value = amount;

    if (amount < 0) {
      this.value = "This value must be greater than 0.";
      this.style.color = "red";
      return false;
    }

    return true;
  };

  /*document.getElementById("trade-leftp-money").onkeydown = this.tradeMoneyOnKeyDown;
  document.getElementById("trade-rightp-money").onkeydown = this.tradeMoneyOnKeyDown;
  document.getElementById("trade-leftp-money").onfocus = this.tradeMoneyOnFocus;
  document.getElementById("trade-rightp-money").onfocus = this.tradeMoneyOnFocus;
  document.getElementById("trade-leftp-money").onchange = this.tradeMoneyOnChange;
  document.getElementById("trade-rightp-money").onchange = this.tradeMoneyOnChange;*/

  resetTrade = function(initiator, recipient, allowRecipientToBeChanged) {
    var currentSquare;
    var currentTableRow;
    var currentTableCell;
    var currentTableCellCheckbox;
    var nameSelect;
    var currentOption;
    var allGroupUninproved;
    var currentName;

    var tableRowOnClick = function(e) {
      var checkboxElement = this.firstChild.firstChild;

      if (checkboxElement !== e.srcElement) {
        checkboxElement.checked = !checkboxElement.checked;
      }

      $("#proposetradebutton").show();
      $("#canceltradebutton").show();
      $("#accepttradebutton").hide();
      $("#rejecttradebutton").hide();
    };

    var initiatorProperty = document.getElementById("trade-leftp-property");
    var recipientProperty = document.getElementById("trade-rightp-property");

    this.currentInitiator = initiator;
    this.currentRecipient = recipient;

    // Empty elements.
    while (initiatorProperty.lastChild) {
      initiatorProperty.removeChild(initiatorProperty.lastChild);
    }

    while (recipientProperty.lastChild) {
      recipientProperty.removeChild(recipientProperty.lastChild);
    }

    var initiatorSideTable = document.createElement("table");
    var recipientSideTable = document.createElement("table");


    for (var i = 0; i < 40; i++) {
      currentSquare = this.square[i];

      // A property cannot be traded if any properties in its group have been improved.
      if (currentSquare.house > 0 || currentSquare.groupNumber === 0) {
        continue;
      }

      allGroupUninproved = true;
      var max = currentSquare.group.length;
      for (var j = 0; j < max; j++) {

        if (this.square[currentSquare.group[j]].house > 0) {
          allGroupUninproved = false;
          break;
        }
      }

      if (!allGroupUninproved) {
        continue;
      }

      // Offered properties.
      if (currentSquare.owner === initiator.index) {
        currentTableRow = initiatorSideTable.appendChild(document.createElement("tr"));
        currentTableRow.onclick = tableRowOnClick;

        currentTableCell = currentTableRow.appendChild(document.createElement("td"));
        currentTableCell.className = "propertycellcheckbox";
        currentTableCellCheckbox = currentTableCell.appendChild(document.createElement("input"));
        currentTableCellCheckbox.type = "checkbox";
        currentTableCellCheckbox.id = "tradeleftcheckbox" + i;
        currentTableCellCheckbox.title = "Check this box to include " + currentSquare.name + " in the trade.";

        currentTableCell = currentTableRow.appendChild(document.createElement("td"));
        currentTableCell.className = "propertycellcolor";
        currentTableCell.style.backgroundColor = currentSquare.color;

        if (currentSquare.groupNumber == 1 || currentSquare.groupNumber == 2) {
          currentTableCell.style.borderColor = "grey";
        } else {
          currentTableCell.style.borderColor = currentSquare.color;
        }

        currentTableCell.propertyIndex = i;
        currentTableCell.onmouseover = function() {this.showdeed(this.propertyIndex);};
        currentTableCell.onmouseout = this.hidedeed;

        currentTableCell = currentTableRow.appendChild(document.createElement("td"));
        currentTableCell.className = "propertycellname";
        if (currentSquare.mortgage) {
          currentTableCell.title = "Mortgaged";
          currentTableCell.style.color = "grey";
        }
        currentTableCell.textContent = currentSquare.name;

        // Requested properties.
      } else if (currentSquare.owner === recipient.index) {
        currentTableRow = recipientSideTable.appendChild(document.createElement("tr"));
        currentTableRow.onclick = tableRowOnClick;

        currentTableCell = currentTableRow.appendChild(document.createElement("td"));
        currentTableCell.className = "propertycellcheckbox";
        currentTableCellCheckbox = currentTableCell.appendChild(document.createElement("input"));
        currentTableCellCheckbox.type = "checkbox";
        currentTableCellCheckbox.id = "traderightcheckbox" + i;
        currentTableCellCheckbox.title = "Check this box to include " + currentSquare.name + " in the trade.";

        currentTableCell = currentTableRow.appendChild(document.createElement("td"));
        currentTableCell.className = "propertycellcolor";
        currentTableCell.style.backgroundColor = currentSquare.color;

        if (currentSquare.groupNumber == 1 || currentSquare.groupNumber == 2) {
          currentTableCell.style.borderColor = "grey";
        } else {
          currentTableCell.style.borderColor = currentSquare.color;
        }

        currentTableCell.propertyIndex = i;
        currentTableCell.onmouseover = function() {this.showdeed(this.propertyIndex);};
        currentTableCell.onmouseout = this.hidedeed;

        currentTableCell = currentTableRow.appendChild(document.createElement("td"));
        currentTableCell.className = "propertycellname";
        if (currentSquare.mortgage) {
          currentTableCell.title = "Mortgaged";
          currentTableCell.style.color = "grey";
        }
        currentTableCell.textContent = currentSquare.name;
      }
    }

    if (initiator.communityChestJailCard) {
      currentTableRow = initiatorSideTable.appendChild(document.createElement("tr"));
      currentTableRow.onclick = tableRowOnClick;

      currentTableCell = currentTableRow.appendChild(document.createElement("td"));
      currentTableCell.className = "propertycellcheckbox";
      currentTableCellCheckbox = currentTableCell.appendChild(document.createElement("input"));
      currentTableCellCheckbox.type = "checkbox";
      currentTableCellCheckbox.id = "tradeleftcheckbox40";
      currentTableCellCheckbox.title = "Check this box to include this Get Out of Jail Free Card in the trade.";

      currentTableCell = currentTableRow.appendChild(document.createElement("td"));
      currentTableCell.className = "propertycellcolor";
      currentTableCell.style.backgroundColor = "white";
      currentTableCell.style.borderColor = "grey";

      currentTableCell = currentTableRow.appendChild(document.createElement("td"));
      currentTableCell.className = "propertycellname";

      currentTableCell.textContent = "Get Out of Jail Free Card";
    } else if (recipient.communityChestJailCard) {
      currentTableRow = recipientSideTable.appendChild(document.createElement("tr"));
      currentTableRow.onclick = tableRowOnClick;

      currentTableCell = currentTableRow.appendChild(document.createElement("td"));
      currentTableCell.className = "propertycellcheckbox";
      currentTableCellCheckbox = currentTableCell.appendChild(document.createElement("input"));
      currentTableCellCheckbox.type = "checkbox";
      currentTableCellCheckbox.id = "traderightcheckbox40";
      currentTableCellCheckbox.title = "Check this box to include this Get Out of Jail Free Card in the trade.";

      currentTableCell = currentTableRow.appendChild(document.createElement("td"));
      currentTableCell.className = "propertycellcolor";
      currentTableCell.style.backgroundColor = "white";
      currentTableCell.style.borderColor = "grey";

      currentTableCell = currentTableRow.appendChild(document.createElement("td"));
      currentTableCell.className = "propertycellname";

      currentTableCell.textContent = "Get Out of Jail Free Card";
    }

    if (initiator.chanceJailCard) {
      currentTableRow = initiatorSideTable.appendChild(document.createElement("tr"));
      currentTableRow.onclick = tableRowOnClick;

      currentTableCell = currentTableRow.appendChild(document.createElement("td"));
      currentTableCell.className = "propertycellcheckbox";
      currentTableCellCheckbox = currentTableCell.appendChild(document.createElement("input"));
      currentTableCellCheckbox.type = "checkbox";
      currentTableCellCheckbox.id = "tradeleftcheckbox41";
      currentTableCellCheckbox.title = "Check this box to include this Get Out of Jail Free Card in the trade.";

      currentTableCell = currentTableRow.appendChild(document.createElement("td"));
      currentTableCell.className = "propertycellcolor";
      currentTableCell.style.backgroundColor = "white";
      currentTableCell.style.borderColor = "grey";

      currentTableCell = currentTableRow.appendChild(document.createElement("td"));
      currentTableCell.className = "propertycellname";

      currentTableCell.textContent = "Get Out of Jail Free Card";
    } else if (recipient.chanceJailCard) {
      currentTableRow = recipientSideTable.appendChild(document.createElement("tr"));
      currentTableRow.onclick = tableRowOnClick;

      currentTableCell = currentTableRow.appendChild(document.createElement("td"));
      currentTableCell.className = "propertycellcheckbox";
      currentTableCellCheckbox = currentTableCell.appendChild(document.createElement("input"));
      currentTableCellCheckbox.type = "checkbox";
      currentTableCellCheckbox.id = "traderightcheckbox41";
      currentTableCellCheckbox.title = "Check this box to include this Get Out of Jail Free Card in the trade.";

      currentTableCell = currentTableRow.appendChild(document.createElement("td"));
      currentTableCell.className = "propertycellcolor";
      currentTableCell.style.backgroundColor = "white";
      currentTableCell.style.borderColor = "grey";

      currentTableCell = currentTableRow.appendChild(document.createElement("td"));
      currentTableCell.className = "propertycellname";

      currentTableCell.textContent = "Get Out of Jail Free Card";
    }

    if (initiatorSideTable.lastChild) {
      initiatorProperty.appendChild(initiatorSideTable);
    } else {
      initiatorProperty.textContent = initiator.name + " has no properties to trade.";
    }

    if (recipientSideTable.lastChild) {
      recipientProperty.appendChild(recipientSideTable);
    } else {
      recipientProperty.textContent = recipient.name + " has no properties to trade.";
    }

    document.getElementById("trade-leftp-name").textContent = initiator.name;

    currentName = document.getElementById("trade-rightp-name");

    if (allowRecipientToBeChanged && this.pcount > 2) {
      // Empty element.
      while (currentName.lastChild) {
        currentName.removeChild(currentName.lastChild);
      }

      nameSelect = currentName.appendChild(document.createElement("select"));
      for (var i = 1; i <= this.pcount; i++) {
        if (i === initiator.index) {
          continue;
        }

        currentOption = nameSelect.appendChild(document.createElement("option"));
        currentOption.value = i + "";
        currentOption.style.color = this.player[i].color;
        currentOption.textContent = this.player[i].name;

        if (i === recipient.index) {
          currentOption.selected = "selected";
        }
      }

      nameSelect.onchange = function() {
        this.resetTrade(this.currentInitiator, this.player[parseInt(this.value, 10)], true);
      };

      nameSelect.title = "Select a this.player to trade with.";
    } else {
      currentName.textContent = recipient.name;
    }

    (<HTMLInputElement>document.getElementById("trade-leftp-money")).value = "0";
    (<HTMLInputElement>document.getElementById("trade-rightp-money")).value = "0";
    //document.getElementById("trade-leftp-money").value = "0";
    //document.getElementById("trade-rightp-money").value = "0";

  };

  readTrade = function() {
    var initiator = this.currentInitiator;
    var recipient = this.currentRecipient;
    var property = new Array(40);
    var money;
    var communityChestJailCard;
    var chanceJailCard;

    for (var i = 0; i < 40; i++) {

      if (document.getElementById("tradeleftcheckbox" + i) &&
        (<HTMLInputElement>document.getElementById("tradeleftcheckbox" + i)).checked) {
        property[i] = 1;
      } else if (document.getElementById("traderightcheckbox" + i) &&
        (<HTMLInputElement>document.getElementById("traderightcheckbox" + i)).checked) {
        property[i] = -1;
      } else {
        property[i] = 0;
      }
    }

    if (document.getElementById("tradeleftcheckbox40") &&
      (<HTMLInputElement>document.getElementById("tradeleftcheckbox40")).checked) {
      communityChestJailCard = 1;
    } else if (document.getElementById("traderightcheckbox40") &&
      (<HTMLInputElement>document.getElementById("traderightcheckbox40")).checked) {
      communityChestJailCard = -1;
    } else {
      communityChestJailCard = 0;
    }

    if (document.getElementById("tradeleftcheckbox41") &&
      (<HTMLInputElement>document.getElementById("tradeleftcheckbox41")).checked) {
      chanceJailCard = 1;
    } else if (document.getElementById("traderightcheckbox41") &&
      (<HTMLInputElement>document.getElementById("traderightcheckbox41")).checked) {
      chanceJailCard = -1;
    } else {
      chanceJailCard = 0;
    }

    money = parseInt((<HTMLInputElement>document.getElementById("trade-leftp-money")).value, 10) || 0;
    money -= parseInt((<HTMLInputElement>document.getElementById("trade-rightp-money")).value, 10) || 0;

    //var trade = new Trade(initiator, recipient, money, property, communityChestJailCard, chanceJailCard);
    var trade = new Trade();
    return trade;
  };

  writeTrade = function(tradeObj) {
    this.resetTrade(tradeObj.getInitiator(), tradeObj.getRecipient(), false);

    for (var i = 0; i < 40; i++) {

      if (document.getElementById("tradeleftcheckbox" + i)) {
        (<HTMLInputElement>document.getElementById("tradeleftcheckbox" + i)).checked = false;
        if (tradeObj.getProperty(i) === 1) {
          (<HTMLInputElement>document.getElementById("tradeleftcheckbox" + i)).checked = true;
        }
      }

      if (document.getElementById("traderightcheckbox" + i)) {
        (<HTMLInputElement>document.getElementById("traderightcheckbox" + i)).checked = false;
        if (tradeObj.getProperty(i) === -1) {
          (<HTMLInputElement>document.getElementById("traderightcheckbox" + i)).checked = true;
        }
      }
    }

    if (document.getElementById("tradeleftcheckbox40")) {
      if (tradeObj.getCommunityChestJailCard() === 1) {
        (<HTMLInputElement>document.getElementById("tradeleftcheckbox40")).checked = true;
      } else {
        (<HTMLInputElement>document.getElementById("tradeleftcheckbox40")).checked = false;
      }
    }

    if (document.getElementById("traderightcheckbox40")) {
      if (tradeObj.getCommunityChestJailCard() === -1) {
        (<HTMLInputElement>document.getElementById("traderightcheckbox40")).checked = true;
      } else {
        (<HTMLInputElement>document.getElementById("traderightcheckbox40")).checked = false;
      }
    }

    if (document.getElementById("tradeleftcheckbox41")) {
      if (tradeObj.getChanceJailCard() === 1) {
        (<HTMLInputElement>document.getElementById("tradeleftcheckbox41")).checked = true;
      } else {
        (<HTMLInputElement>document.getElementById("tradeleftcheckbox41")).checked = false;
      }
    }

    if (document.getElementById("traderightcheckbox41")) {
      if (tradeObj.getChanceJailCard() === -1) {
        (<HTMLInputElement>document.getElementById("traderightcheckbox41")).checked = true;
      } else {
        (<HTMLInputElement>document.getElementById("traderightcheckbox41")).checked = false;
      }
    }

    if (tradeObj.getMoney() > 0) {
      (<HTMLInputElement>document.getElementById("trade-leftp-money")).value = tradeObj.getMoney() + "";
    } else {
      (<HTMLInputElement>document.getElementById("trade-rightp-money")).value = (-tradeObj.getMoney()) + "";
    }

  };

  trade = function(tradeObj) {
    $("#board").hide();
    $("#control").hide();
    $("#trade").show();
    $("#proposetradebutton").show();
    $("#canceltradebutton").show();
    $("#accepttradebutton").hide();
    $("#rejecttradebutton").hide();

    if (tradeObj instanceof Trade) {
      this.writeTrade(tradeObj);
      this.proposeTrade();
    } else {
      var initiator = this.player[this.turn];
      var recipient = this.turn === 1 ? this.player[2] : this.player[1];

      this.currentInitiator = initiator;
      this.currentRecipient = recipient;

      this.resetTrade(initiator, recipient, true);
    }
  };


  cancelTrade = function() {
    $("#board").show();
    $("#control").show();
    $("#trade").hide();


    if (!this.player[this.turn].human) {
      this.player[this.turn].AI.alertList = "";
      this.game.next();
    }

  };

  acceptTrade = function(tradeObj) {
    if (isNaN(parseInt((<HTMLInputElement>document.getElementById("trade-leftp-money")).value,10))) {
      (<HTMLInputElement>document.getElementById("trade-leftp-money")).value = "This value must be a number.";
      document.getElementById("trade-leftp-money").style.color = "red";
      return false;
    }

    if (isNaN(parseInt((<HTMLInputElement>document.getElementById("trade-rightp-money")).value,10))) {
      (<HTMLInputElement>document.getElementById("trade-rightp-money")).value = "This value must be a number.";
      document.getElementById("trade-rightp-money").style.color = "red";
      return false;
    }

    var showAlerts = true;
    var money;
    var initiator;
    var recipient;

    if (tradeObj) {
      showAlerts = false;
    } else {
      tradeObj = this.readTrade();
    }

    money = tradeObj.getMoney();
    initiator = tradeObj.getInitiator();
    recipient = tradeObj.getRecipient();


    if (money > 0 && money > initiator.money) {
      (<HTMLInputElement>document.getElementById("trade-leftp-money")).value = initiator.name + " does not have $" + money + ".";
      document.getElementById("trade-leftp-money").style.color = "red";
      return false;
    } else if (money < 0 && -money > recipient.money) {
      (<HTMLInputElement>document.getElementById("trade-rightp-money")).value = recipient.name + " does not have $" + (-money) + ".";
      document.getElementById("trade-rightp-money").style.color = "red";
      return false;
    }

    var isAPropertySelected = 0;

    // Ensure that some properties are selected.
    for (var i = 0; i < 40; i++) {
      isAPropertySelected |= tradeObj.getProperty(i);
    }

    isAPropertySelected |= tradeObj.getCommunityChestJailCard();
    isAPropertySelected |= tradeObj.getChanceJailCard();

    if (isAPropertySelected === 0) {
      this.popup("<p>One or more properties must be selected in order to trade.</p>");

      return false;
    }

    if (showAlerts && !confirm(initiator.name + ", are you sure you want to make this exchange with " + recipient.name + "?")) {
      return false;
    }

    // Exchange properties
    for (var i = 0; i < 40; i++) {

      if (tradeObj.getProperty(i) === 1) {
        this.square[i].owner = recipient.index;
        this.addAlert(recipient.name + " received " + this.square[i].name + " from " + initiator.name + ".");
      } else if (tradeObj.getProperty(i) === -1) {
        this.square[i].owner = initiator.index;
        this.addAlert(initiator.name + " received " + this.square[i].name + " from " + recipient.name + ".");
      }

    }

    if (tradeObj.getCommunityChestJailCard() === 1) {
      initiator.communityChestJailCard = false;
      recipient.communityChestJailCard = true;
      this.addAlert(recipient.name + ' received a "Get Out of Jail Free" card from ' + initiator.name + ".");
    } else if (tradeObj.getCommunityChestJailCard() === -1) {
      initiator.communityChestJailCard = true;
      recipient.communityChestJailCard = false;
      this.addAlert(initiator.name + ' received a "Get Out of Jail Free" card from ' + recipient.name + ".");
    }

    if (tradeObj.getChanceJailCard() === 1) {
      initiator.chanceJailCard = false;
      recipient.chanceJailCard = true;
      this.addAlert(recipient.name + ' received a "Get Out of Jail Free" card from ' + initiator.name + ".");
    } else if (tradeObj.getChanceJailCard() === -1) {
      initiator.chanceJailCard = true;
      recipient.chanceJailCard = false;
      this.addAlert(initiator.name + ' received a "Get Out of Jail Free" card from ' + recipient.name + ".");
    }

    // Exchange money.
    if (money > 0) {
      initiator.pay(money, recipient.index);
      recipient.money += money;

      this.addAlert(recipient.name + " received $" + money + " from " + initiator.name + ".");
    } else if (money < 0) {
      money = -money;

      recipient.pay(money, initiator.index);
      initiator.money += money;

      this.addAlert(initiator.name + " received $" + money + " from " + recipient.name + ".");
    }

    this.updateOwned();
    this.updateMoney();

    $("#board").show();
    $("#control").show();
    $("#trade").hide();

    if (!this.player[this.turn].human) {
      this.player[this.turn].AI.alertList = "";
      this.game.next();
    }
  };

  proposeTrade = function() {
    if (isNaN(parseInt((<HTMLInputElement>document.getElementById("trade-leftp-money")).value,10))) {
      (<HTMLInputElement>document.getElementById("trade-leftp-money")).value = "This value must be a number.";
      document.getElementById("trade-leftp-money").style.color = "red";
      return false;
    }

    if (isNaN(parseInt((<HTMLInputElement>document.getElementById("trade-rightp-money")).value,10))) {
      (<HTMLInputElement>document.getElementById("trade-rightp-money")).value = "This value must be a number.";
      document.getElementById("trade-rightp-money").style.color = "red";
      return false;
    }

    var tradeObj = this.readTrade();
    var money = tradeObj.getMoney();
    var initiator = tradeObj.getInitiator();
    var recipient = tradeObj.getRecipient();
    var reversedTradeProperty = [];

    if (money > 0 && money > initiator.money) {
      (<HTMLInputElement>document.getElementById("trade-leftp-money")).value = initiator.name + " does not have $" + money + ".";
      document.getElementById("trade-leftp-money").style.color = "red";
      return false;
    } else if (money < 0 && -money > recipient.money) {
      (<HTMLInputElement>document.getElementById("trade-rightp-money")).value = recipient.name + " does not have $" + (-money) + ".";
      document.getElementById("trade-rightp-money").style.color = "red";
      return false;
    }

    var isAPropertySelected = 0;

    // Ensure that some properties are selected.
    for (var i = 0; i < 40; i++) {
      reversedTradeProperty[i] = -tradeObj.getProperty(i);
      isAPropertySelected |= tradeObj.getProperty(i);
    }

    isAPropertySelected |= tradeObj.getCommunityChestJailCard();
    isAPropertySelected |= tradeObj.getChanceJailCard();

    if (isAPropertySelected === 0) {
      this.popup("<p>One or more properties must be selected in order to trade.</p>");

      return false;
    }

    if (initiator.human && !confirm(initiator.name + ", are you sure you want to make this offer to " + recipient.name + "?")) {
      return false;
    }

    //var reversedTrade = new Trade(recipient, initiator, -money, reversedTradeProperty, -tradeObj.getCommunityChestJailCard(), -tradeObj.getChanceJailCard());
    var reversedTrade = new Trade();

    if (recipient.human) {

      this.writeTrade(reversedTrade);

      $("#proposetradebutton").hide();
      $("#canceltradebutton").hide();
      $("#accepttradebutton").show();
      $("#rejecttradebutton").show();

      this.addAlert(initiator.name + " initiated a trade with " + recipient.name + ".");
      this.popup("<p>" + initiator.name + " has proposed a trade with you, " + recipient.name + ". You may accept, reject, or modify the offer.</p>");
    } else {
      var tradeResponse = recipient.AI.acceptTrade(tradeObj);

      if (tradeResponse === true) {
        this.popup("<p>" + recipient.name + " has accepted your offer.</p>");
        this.acceptTrade(reversedTrade);
      } else if (tradeResponse === false) {
        this.popup("<p>" + recipient.name + " has declined your offer.</p>");
        return;
      } else if (tradeResponse instanceof Trade) {
        this.popup("<p>" + recipient.name + " has proposed a counteroffer.</p>");
        this.writeTrade(tradeResponse);

        $("#proposetradebutton, #canceltradebutton").hide();
        $("#accepttradebutton").show();
        $("#rejecttradebutton").show();
      }
    }
  };


  // Bankrupcy functions:

  eliminatePlayer = function() {
    var p = this.player[this.turn];

    for (var i = p.index; i < this.pcount; i++) {
      this.player[i] = this.player[i + 1];
      this.player[i].index = i;

    }

    for (var k = 0; k < 40; k++) {
      if (this.square[k].owner >= p.index) {
        this.square[k].owner--;
      }
    }

    this.pcount--;
    this.turn--;

    if (this.pcount === 2) {
      document.getElementById("stats").style.width = "454px";
    } else if (this.pcount === 3) {
      document.getElementById("stats").style.width = "686px";
    }

    if (this.pcount === 1) {
      this.updateMoney();
      $("#control").hide();
      $("#board").hide();
      $("#refresh").show();

      // // Display land counts for survey purposes.
      // var text;
      // for (var i = 0; i < 40; i++) {
      // if (i === 0)
      // text = square[i].landcount;
      // else
      // text += " " + square[i].landcount;
      // }
      // document.getElementById("refresh").innerHTML += "<br><br><div><textarea type='text' style='width: 980px;' onclick='javascript:select();' />" + text + "</textarea></div>";

      this.popup("<p>Congratulations, " + this.player[1].name + ", you have won the game.</p><div>");

    } else {
      this.play();
    }
  };

  bankruptcyUnmortgage = function() {
    var p = this.player[this.turn];

    if (p.creditor === 0) {
      this.eliminatePlayer();
      return;
    }

    var HTML = "<p>" + this.player[p.creditor].name + ", you may unmortgage any of the following properties, interest free, by clicking on them. Click OK when finished.</p><table>";
    var price;

    for (var i = 0; i < 40; i++) {
      var sq = this.square[i];
      if (sq.owner == p.index && sq.mortgage) {
        price = Math.round(sq.price * 0.5);

        HTML += "<tr><td class='propertycellcolor' style='background: " + sq.color + ";";

        if (sq.groupNumber == 1 || sq.groupNumber == 2) {
          HTML += " border: 1px solid grey;";
        } else {
          HTML += " border: 1px solid " + sq.color + ";";
        }

        // Player already paid interest, so they can unmortgage for the mortgage price.
        HTML += "' onmouseover='showdeed(" + i + ");' onmouseout='hidedeed();'></td><td class='propertycellname'><a href='javascript:void(0);' title='Unmortgage " + sq.name + " for $" + price + ".' onclick='if (" + price + " <= this.player[" + p.creditor + "].money) {this.player[" + p.creditor + "].pay(" + price + ", 0); square[" + i + "].mortgage = false; addAlert(\"" + this.player[p.creditor].name + " unmortgaged " + sq.name + " for $" + price + ".\");} this.parentElement.parentElement.style.display = \"none\";'>Unmortgage " + sq.name + " ($" + price + ")</a></td></tr>";

        sq.owner = p.creditor;

      }
    }

    HTML += "</table>";

    this.popup(HTML, this.game.eliminatePlayer);
  };

  resign = function() {
    this.popup("<p>Are you sure you want to resign?</p>", this.game.bankruptcy, "Yes/No");
  };

  bankruptcy = function() {
    var p = this.player[this.turn];
    var pcredit = this.player[p.creditor];
    var bankruptcyUnmortgageFee = 0;


    if (p.money >= 0) {
      return;
    }

   this.addAlert(p.name + " is bankrupt.");

    if (p.creditor !== 0) {
      pcredit.money += p.money;
    }

    for (var i = 0; i < 40; i++) {
      var sq = this.square[i];
      if (sq.owner == p.index) {
        // Mortgaged properties will be tranfered by bankruptcyUnmortgage();
        if (!sq.mortgage) {
          sq.owner = p.creditor;
        } else {
          bankruptcyUnmortgageFee += Math.round(sq.price * 0.1);
        }

        if (sq.house > 0) {
          if (p.creditor !== 0) {
            pcredit.money += sq.houseprice * 0.5 * sq.house;
          }
          sq.hotel = 0;
          sq.house = 0;
        }

        if (p.creditor === 0) {
          sq.mortgage = false;
          this.addPropertyToAuctionQueue(i);
          sq.owner = 0;
        }
      }
    }

    this.updateMoney();

    if (p.chanceJailCard) {
      p.chanceJailCard = false;
      pcredit.chanceJailCard = true;
    }

    if (p.communityChestJailCard) {
      p.communityChestJailCard = false;
      pcredit.communityChestJailCard = true;
    }

    if (this.pcount === 2 || bankruptcyUnmortgageFee === 0 || p.creditor === 0) {
      this.eliminatePlayer();
    } else {
      this.addAlert(pcredit.name + " paid $" + bankruptcyUnmortgageFee + " interest on the mortgaged properties received from " + p.name + ".");
      this.popup("<p>" + pcredit.name + ", you must pay $" + bankruptcyUnmortgageFee + " interest on the mortgaged properties you received from " + p.name + ".</p>", function() {this.player[pcredit.index].pay(bankruptcyUnmortgageFee, 0); this.bankruptcyUnmortgage();});
    }
  };

  showdeed(property) {
  var sq = this.square[property];
  $("#deed").show();

  $("#deed-normal").hide();
  $("#deed-mortgaged").hide();
  $("#deed-special").hide();

  if (sq.mortgage) {
    $("#deed-mortgaged").show();
    document.getElementById("deed-mortgaged-name").textContent = sq.name;
    document.getElementById("deed-mortgaged-mortgage").textContent = String(sq.price / 2);

  } else {

    if (sq.groupNumber >= 3) {
      $("#deed-normal").show();
      document.getElementById("deed-header").style.backgroundColor = sq.color;
      document.getElementById("deed-name").textContent = sq.name;
      document.getElementById("deed-baserent").textContent = sq.baserent;
      document.getElementById("deed-rent1").textContent = sq.rent1;
      document.getElementById("deed-rent2").textContent = sq.rent2;
      document.getElementById("deed-rent3").textContent = sq.rent3;
      document.getElementById("deed-rent4").textContent = sq.rent4;
      document.getElementById("deed-rent5").textContent = sq.rent5;
      document.getElementById("deed-mortgage").textContent = String(sq.price / 2);
      document.getElementById("deed-houseprice").textContent = sq.houseprice;
      document.getElementById("deed-hotelprice").textContent = sq.houseprice;

    } else if (sq.groupNumber == 2) {
      $("#deed-special").show();
      document.getElementById("deed-special-name").textContent = sq.name;
      document.getElementById("deed-special-text").innerHTML = this.utiltext();
      document.getElementById("deed-special-mortgage").textContent = String(sq.price / 2);

    } else if (sq.groupNumber == 1) {
      $("#deed-special").show();
      document.getElementById("deed-special-name").textContent = sq.name;
      document.getElementById("deed-special-text").innerHTML = this.transtext();
      document.getElementById("deed-special-mortgage").textContent = String(sq.price / 2);
    }
  }
}

  hidedeed() {
    $("#deed").hide();
  }

  utiltext() {
    return '&nbsp;&nbsp;&nbsp;&nbsp;If one "Utility" is owned rent is 4 times amount shown on dice.<br /><br />&nbsp;&nbsp;&nbsp;&nbsp;If both "Utilitys" are owned rent is 10 times amount shown on dice.';
  }

  transtext() {
    return '<div style="font-size: 14px; line-height: 1.5;">Rent<span style="float: right;">$25.</span><br />If 2 Transportations are owned<span style="float: right;">50.</span><br />If 3 &nbsp; &nbsp; " &nbsp; &nbsp; " &nbsp; &nbsp; "<span style="float: right;">100.</span><br />If 4 &nbsp; &nbsp; " &nbsp; &nbsp; " &nbsp; &nbsp; "<span style="float: right;">200.</span></div>';
  }

}
