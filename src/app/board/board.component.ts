///<reference path="../space.ts"/>
import { Component, OnInit } from '@angular/core';
import {Space} from "../space";
import {Card} from "../card";
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  private spaceApiUrl = 'assets/data/newyorkcity.json';

  space = [];
  spaceData: any = [];
  communityChestCards = [];
  chanceCards = [];

  constructor(private http: Http) {

    this.getSpacesConfiguration();

    /*this.space[0] = new Space("GO", "COLLECT $200 SALARY AS YOU PASS.", "white",undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined);
    this.space[1] = new Space("Port Authority Bus Terminal", "$60", "#4B0082", 60, 3, 2, 10, 30, 90, 160, 250);
    this.space[2] = new Space("Community Chest", "FOLLOW INSTRUCTIONS ON TOP CARD", "white",undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined);
    this.space[3] = new Space("Lincoln Tunnel", "$60", "#4B0082", 60, 3, 4, 20, 60, 180, 320, 450);
    this.space[4] = new Space("City Tax", "PAY 10% OR $200", "white",undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined);
    this.space[5] = new Space("LOMTO", "$200", "white", 200, 1,undefined,undefined,undefined,undefined,undefined,undefined);
    this.space[6] = new Space("Statue of Liberty", "$100", "#AACCFF", 100, 4, 6, 30, 90, 270, 400, 550);
    this.space[7] = new Space("Chance", "NEW YORK LOTTERY GAMES", "white",undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined);
    this.space[8] = new Space("Empire State Building", "$100", "#AACCFF", 100, 4, 6, 30, 90, 270, 400, 550);
    this.space[9] = new Space("Central Park", "$120", "#AACCFF", 120, 4, 8, 40, 100, 300, 450, 600);
    this.space[10] = new Space("Just Visiting", "", "white",undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined);
    this.space[11] = new Space("98.7 Kiss FM", "$140", "purple", 140, 5, 10, 50, 150, 450, 625, 750);
    this.space[12] = new Space("Con Edison Electric", "$150", "white", 150, 2,undefined,undefined,undefined,undefined,undefined,undefined);
    this.space[13] = new Space("Thirteen WNET", "$140", "purple", 140, 5, 10, 50, 150, 450, 625, 750);
    this.space[14] = new Space("The New York Times", "$160", "purple", 160, 5, 12, 60, 180, 500, 700, 900);
    this.space[15] = new Space("New York City Transit", "$200", "white", 200, 1,undefined,undefined,undefined,undefined,undefined,undefined);
    this.space[16] = new Space("New York Rangers", "$180", "orange", 180, 6, 14, 70, 200, 550, 750, 950);
    this.space[17] = new Space("Community Chest", "FOLLOW INSTRUCTIONS ON TOP CARD", "white",undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined);
    this.space[18] = new Space("New York Knicks", "$180", "orange", 180, 6, 14, 70, 200, 550, 750, 950);
    this.space[19] = new Space("Madison Space Garden", "$200", "orange", 200, 6, 16, 80, 220, 600, 800, 1000);
    this.space[20] = new Space("Free Parking", "", "white",undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined);
    this.space[21] = new Space("macy*s", "$220", "red", 220, 7, 18, 90, 250, 700, 875, 1050);
    this.space[22] = new Space("Chance", "NEW YORK LOTTERY GAMES", "white",undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined);
    this.space[23] = new Space("FAO Schwarz", "$220", "red", 220, 7, 18, 90, 250, 700, 875, 1050);
    this.space[24] = new Space("bloomingdale's", "$240", "red", 240, 7, 20, 100, 300, 750, 925, 1100);
    this.space[25] = new Space("Metro-North Railroad", "$200", "white", 200, 1,undefined,undefined,undefined,undefined,undefined,undefined);
    this.space[26] = new Space("Deloitte & Touche LLP", "$260", "yellow", 260, 8, 22, 110, 330, 800, 975, 1150);
    this.space[27] = new Space("SmithBarney", "$260", "yellow", 260, 8, 22, 110, 330, 800, 975, 1150);
    this.space[28] = new Space("Con Edison Gas", "$150", "white", 150, 2,undefined,undefined,undefined,undefined,undefined,undefined);
    this.space[29] = new Space("CITIBANK", "$280", "yellow", 280, 8, 24, 120, 360, 850, 1025, 1200);
    this.space[30] = new Space("Go to Jail", "Go directly to Jail. Do not pass GO. Do not collect $200.", "white",undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined);
    this.space[31] = new Space("The Regency Hotel", "$300", "green", 300, 9, 26, 130, 390, 900, 110, 1275);
    this.space[32] = new Space("Essex House", "$300", "green", 300, 9, 26, 130, 390, 900, 110, 1275);
    this.space[33] = new Space("Community Chest", "FOLLOW INSTRUCTIONS ON TOP CARD", "white",undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined);
    this.space[34] = new Space("The Plaza", "$320", "green", 320, 9, 28, 150, 450, 1000, 1200, 1400);
    this.space[35] = new Space("United Airlines", "$200", "white", 200, 1,undefined,undefined,undefined,undefined,undefined,undefined);
    this.space[36] = new Space("Chance", "NEW YORK LOTTERY GAMES", "white",undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined);
    this.space[37] = new Space("Tiffany & CO.", "$350", "blue", 350, 10, 35, 175, 500, 1100, 1300, 1500);
    this.space[38] = new Space("LUXURY TAX", "Pay $75", "white",undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined);
    this.space[39] = new Space("TRUMP TOWER", "$400", "blue", 400, 10, 50, 200, 600, 1400, 1700, 2000);
*/
    /*this.communityChestCards[0] = new Card("Get out of Jail, Free. This card may be kept until needed or sold.", function() { p.communityChestJailCard = true; updateOwned();});
    this.communityChestCards[1] = new Card("You have won lifetime home delivery of the New York Times. Collect $10", function() { addamount(10, 'Community Chest');});
    this.communityChestCards[2] = new Card("From sale of Macy's stock, you get $45", function() { addamount(45, 'Community Chest');});
    this.communityChestCards[3] = new Card("Life insurance matures. Collect $100", function() { addamount(100, 'Community Chest');});
    this.communityChestCards[4] = new Card("Deloitte & Touche LLP tax return Collect $20", function() { addamount(20, 'Community Chest');});
    this.communityChestCards[5] = new Card("FAO Schwarz Xmas fund matures. Collect $100", function() { addamount(100, 'Community Chest');});
    this.communityChestCards[6] = new Card("You have won a United Airlines trip around the world! Collect $100", function() { addamount(100, 'Community Chest');});
    this.communityChestCards[7] = new Card("Performed a wedding at the Plaza Hotel. Receive $25", function() { addamount(25, 'Community Chest');});
    this.communityChestCards[8] = new Card("Pay hospital $100", function() { subtractamount(100, 'Community Chest');});
    this.communityChestCards[9] = new Card("You won the Lottery! Collect $200", function() { addamount(200, 'Community Chest');});
    this.communityChestCards[10] = new Card("Pay school tax of $150", function() { subtractamount(150, 'Community Chest');});
    this.communityChestCards[11] = new Card("Doctor's fee. Pay $50", function() { subtractamount(50, 'Community Chest');});
    this.communityChestCards[12] = new Card("Madison Space Garden opening tonight. Collect $50 from every player for opening night seats.", function() { collectfromeachplayer(50, 'Community Chest');});
    this.communityChestCards[13] = new Card("You have won kiss cash! Advance to GO (Collect $200)", function() { advance(0);});
    this.communityChestCards[14] = new Card("You are assessed for street repairs. $40 per house. $115 per hotel.", function() { streetrepairs(40, 115);});
    this.communityChestCards[15] = new Card("Go to Jail. Go directly to Jail. Do not pass GO. Do not collect $200.", function() { gotojail();});


    this.chanceCards[0] = new Card("Get out of Jail free. This card may be kept until needed or sold.", function() { p.chanceJailCard=true; updateOwned();});
    this.chanceCards[1] = new Card("Make general repairs on all your property. For each house pay $25. For each hotel $100.", function() { streetrepairs(25, 100);});
    this.chanceCards[2] = new Card("Pay poor tax of $15.", function() { subtractamount(15, 'Chance');});
    this.chanceCards[3] = new Card("You have been elected chairman of Con Edison. Pay each player $50.", function() { payeachplayer(50, 'Chance');});
    this.chanceCards[4] = new Card("Go back 3 this.spaces.", function() { gobackthreethis.spaces();});
    this.chanceCards[5] = new Card("Advance token to the nearest Con Edison utility. If UNOWNED you may buy it from the bank. If OWNED, throw dice and pay owner a total of ten times the amount thrown.", function() { advanceToNearestUtility();});
    this.chanceCards[6] = new Card("Citibank pays you interest of $50.", function() { addamount(50, 'Chance');});
    this.chanceCards[7] = new Card("Advance token to the nearest Transportation and pay owner Twice the Rental to which they are otherwise entitled. If Transportation is unowned, you may buy it from the Bank.", function() { advanceToNearestRailroad();});
    this.chanceCards[8] = new Card("Take a walk past The Essex House. Advance to GO. Collect $200.", function() { advance(0,32);});
    this.chanceCards[9] = new Card("Take a ride to the Regency Hotel! If you pass GO collect $200.", function() { advance(31);});
    this.chanceCards[10] = new Card("Take a walk on fifth avenue. Advance token to Trump Tower.", function() { advance(39);});
    this.chanceCards[11] = new Card("Advance to thirteen.", function() { advance(13);});
    this.chanceCards[12] = new Card("Your Smith Barney mutual fund pays dividend. Collect $150.", function() { addamount(150, 'Chance');});
    this.chanceCards[13] = new Card("Advance token to the nearest Transportation and pay owner Twice the Rental to which they are otherwise entitled.\n\nIf Transportation is unowned, you may buy it from the Bank.", function() { advanceToNearestRailroad();});
    this.chanceCards[14] = new Card("Catch a bus to Central Park. If you pass GO, collect $200.", function() { advance(9);});
    this.chanceCards[15] = new Card("Go directly to Jail. Do not pass GO, do not collect $200.", function() { gotojail();});*/

  }

  ngOnInit() {

    // Add the Go space

    // Loop through the this.space array and add each space on the top

    // Add the top right corner

    // Loop through and add the right side spaces

    // Add the bottom right corner

    // Loop through and add the bottom side spaces

    // Add the bottom left corner

    // Loop through and add the left side spaces
  }

  getData(){
    return this.http.get(this.spaceApiUrl)
      .map((res: Response) => res.json());
  }

  getSpacesConfiguration(){
    this.getData().subscribe(data => {
      //console.log(data);
      this.spaceData = data;

      for(var i = 0, len = this.spaceData.length; i < len; i++)
      {
          this.space[i] = new Space(this.spaceData[i].Name,
          this.spaceData[i].PriceText,
          this.spaceData[i].Color,
          this.spaceData[i].Price,
          this.spaceData[i].GroupNumber,
          this.spaceData[i].BaseRent,
          this.spaceData[i].Rent1,
          this.spaceData[i].Rent2,
          this.spaceData[i].Rent3,
          this.spaceData[i].Rent4,
          this.spaceData[i].Rent5
        );
      }

      //console.log(this.spaceData[i].Name);


    })
  }

}
