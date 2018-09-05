
var db = new SQL.Database();

//db threat agent
sqlThreatAgent = "CREATE TABLE threatAgent (name char, skillLevel int);";
sqlThreatAgent += "INSERT INTO threatAgent VALUES ('Government Hacker', 3);"
sqlThreatAgent += "INSERT INTO threatAgent VALUES ('Hacktivist', 3);"
sqlThreatAgent += "INSERT INTO threatAgent VALUES ('Terrorist', 3);"
sqlThreatAgent += "INSERT INTO threatAgent VALUES ('Hacker', 3);"
sqlThreatAgent += "INSERT INTO threatAgent VALUES ('Competitor / Hireling Hacker', 2);"
sqlThreatAgent += "INSERT INTO threatAgent VALUES ('Insider', 2);"
sqlThreatAgent += "INSERT INTO threatAgent VALUES ('Script Kiddie', 1);"
sqlThreatAgent += "INSERT INTO threatAgent VALUES ('Unpredictable Person', 1);"
sqlThreatAgent += "INSERT INTO threatAgent VALUES ('Unware', 1);"
db.run(sqlThreatAgent); // Run the query without returning anything
var threatAgentDB = db.exec("SELECT name FROM threatAgent");
var fullThreatAgentDB = db.exec("SELECT * FROM threatAgent");

//db attackStrategy
sqlAttack = "CREATE TABLE attackStrategy (name char, skill int, likelihood int, id char);";
sqlAttack += "INSERT INTO attackStrategy VALUES ('OSINT', 1, 5, 'abc0');"
sqlAttack += "INSERT INTO attackStrategy VALUES ('*shing', 2, 4, 'abc1');"
sqlAttack += "INSERT INTO attackStrategy VALUES ('Manipulating  Human Behavior', 3, 3, 'abc2');"
sqlAttack += "INSERT INTO attackStrategy VALUES ('Human Targeted Attack', 3, 1, 'abc3');"
sqlAttack += "INSERT INTO attackStrategy VALUES ('Impersonification', 2, 3, 'abc4');"
sqlAttack += "INSERT INTO attackStrategy VALUES ('Scanning / Footprinting', 1, 5, 'abc5');"
sqlAttack += "INSERT INTO attackStrategy VALUES ('Fuzzing', 2, 4, 'abc6');"
sqlAttack += "INSERT INTO attackStrategy VALUES ('Protocol analysis & abuse', 2, 3, 'abc7');"
sqlAttack += "INSERT INTO attackStrategy VALUES ('Protocol analysis & abuse', 2, 3, 'abc71');"
sqlAttack += "INSERT INTO attackStrategy VALUES ('Gain a foothold', 1, 3, 'abc8');"
sqlAttack += "INSERT INTO attackStrategy VALUES ('Gain a foothold', 1, 3, 'abc81');"
sqlAttack += "INSERT INTO attackStrategy VALUES ('Malware', 2, 4, 'abc9');"
sqlAttack += "INSERT INTO attackStrategy VALUES ('Reverse engineering', 3, 1, 'abc10');"
sqlAttack += "INSERT INTO attackStrategy VALUES ('Dos / Botnet', 2, 3, 'abc11');"
sqlAttack += "INSERT INTO attackStrategy VALUES ('Manipulation during distribution', 3, 3, 'abc12');"
sqlAttack += "INSERT INTO attackStrategy VALUES ('Zero Day', 3, 1, 'abc13');"
sqlAttack += "INSERT INTO attackStrategy VALUES ('Known Exploit', 2, 5, 'abc14');"
sqlAttack += "INSERT INTO attackStrategy VALUES ('Password Guessing', 1, 5, 'abc15');"
sqlAttack += "INSERT INTO attackStrategy VALUES ('Web app attack', 1, 5, 'abc16');"
sqlAttack += "INSERT INTO attackStrategy VALUES ('Persistence', 2, 3, 'abc17');"
sqlAttack += "INSERT INTO attackStrategy VALUES ('Ransomware', 3, 3, 'abc18');"
sqlAttack += "INSERT INTO attackStrategy VALUES ('Post Exploitation activities', 3, 3, 'abc19');"
sqlAttack += "INSERT INTO attackStrategy VALUES ('Physical information gathering', 1, 3, 'abc20');"
sqlAttack += "INSERT INTO attackStrategy VALUES ('Physical Theft', 1, 3, 'abc21');"
sqlAttack += "INSERT INTO attackStrategy VALUES ('Dropping Unauthorized Item', 2, 2, 'abc22');"
sqlAttack += "INSERT INTO attackStrategy VALUES ('Dropping Dangerous Item', 3, 1, 'abc23');"
sqlAttack += "INSERT INTO attackStrategy VALUES ('Bypassing Physical security', 2, 3, 'abc24');"
sqlAttack += "INSERT INTO attackStrategy VALUES ('Device Manipulation', 2, 2, 'abc25');"
db.run(sqlAttack); // Run the query without returning anything
var sqlAttack = db.exec("SELECT * FROM attackStrategy");

//db company
sqlCompany = "CREATE TABLE company (type char);";
sqlCompany += "INSERT INTO company VALUES ('Information');"
sqlCompany += "INSERT INTO company VALUES ('Heathcare');"
sqlCompany += "INSERT INTO company VALUES ('Finance');"
sqlCompany += "INSERT INTO company VALUES ('Accommodation');"
sqlCompany += "INSERT INTO company VALUES ('Administrative');"
sqlCompany += "INSERT INTO company VALUES ('Agriculture');"
sqlCompany += "INSERT INTO company VALUES ('Construction');"
sqlCompany += "INSERT INTO company VALUES ('Education');"
sqlCompany += "INSERT INTO company VALUES ('Entertainment');"
sqlCompany += "INSERT INTO company VALUES ('Management');"
sqlCompany += "INSERT INTO company VALUES ('Manufacturing');"
sqlCompany += "INSERT INTO company VALUES ('Mining');"
sqlCompany += "INSERT INTO company VALUES ('Other Services');"
sqlCompany += "INSERT INTO company VALUES ('Professional');"
sqlCompany += "INSERT INTO company VALUES ('Public');"
sqlCompany += "INSERT INTO company VALUES ('Real Estate');"
sqlCompany += "INSERT INTO company VALUES ('Retail');"
sqlCompany += "INSERT INTO company VALUES ('Trade');"
sqlCompany += "INSERT INTO company VALUES ('Transportation');"
sqlCompany += "INSERT INTO company VALUES ('Utilities');"
db.run(sqlCompany); // Run the query without returning anything
var companyDB = db.exec("SELECT * FROM company");

//db Assets
sqlAsset = "CREATE TABLE asset (name char);";
sqlAsset += "INSERT INTO asset VALUES ('IPR');"
sqlAsset += "INSERT INTO asset VALUES ('Data');"
sqlAsset += "INSERT INTO asset VALUES ('Innovation');"
sqlAsset += "INSERT INTO asset VALUES ('Brand');"
sqlAsset += "INSERT INTO asset VALUES ('Reputation');"
sqlAsset += "INSERT INTO asset VALUES ('Key competences and human capital');"
sqlAsset += "INSERT INTO asset VALUES ('Organisational capital');"
sqlAsset += "INSERT INTO asset VALUES ('Current Assets');"
sqlAsset += "INSERT INTO asset VALUES ('Fixed Assets');"
db.run(sqlAsset); // Run the query without returning anything
var assetDB = db.exec("SELECT * FROM asset");

//db attack goal
sqlGoal = "CREATE TABLE goal (name char);";
sqlGoal += "INSERT INTO goal VALUES ('Dominance');"
sqlGoal += "INSERT INTO goal VALUES ('Organizational Gain');"
sqlGoal += "INSERT INTO goal VALUES ('Ideology');"
sqlGoal += "INSERT INTO goal VALUES ('Disgruntlement');"
sqlGoal += "INSERT INTO goal VALUES ('Personal Financial Gain');"
sqlGoal += "INSERT INTO goal VALUES ('Personal Satisfaction');"
sqlGoal += "INSERT INTO goal VALUES ('Coercion');"
sqlGoal += "INSERT INTO goal VALUES ('Notoriety');"
sqlGoal += "INSERT INTO goal VALUES ('Accidental');"
sqlGoal += "INSERT INTO goal VALUES ('Unpredictable');"
db.run(sqlGoal); // Run the query without returning anything
var goalDB = db.exec("SELECT * FROM goal");

//db question attack goal
sqlQuestion = "CREATE TABLE question (name char);";
sqlQuestion += "INSERT INTO question VALUES ('Does your company manage relevant/important data?');"
sqlQuestion += "INSERT INTO question VALUES ('Does your company have a national or international visibility?');"
sqlQuestion += "INSERT INTO question VALUES ('Does your company manage critical infrastructure/SCADA?');"
sqlQuestion += "INSERT INTO question VALUES ('Does your company have offices in countries with political tensions?');"
sqlQuestion += "INSERT INTO question VALUES ('Is your company a potential target for political, ethnical, religious or environmental reasons?');"
sqlQuestion += "INSERT INTO question VALUES ('Does your company have government contracts?');"
sqlQuestion += "INSERT INTO question VALUES ('Does your company have a negative media impact? ');"
sqlQuestion += "INSERT INTO question VALUES ('Does your company operate in a war zone?');"
sqlQuestion += "INSERT INTO question VALUES ('Does your company work closely with high-profile people?');"
sqlQuestion += "INSERT INTO question VALUES ('Does your company manage relevant data that could be easily resold to competitors or in black markets?');"
sqlQuestion += "INSERT INTO question VALUES ('Does your company have a well-known brand?');"
sqlQuestion += "INSERT INTO question VALUES ('Does your company has industrial secrets or intellectual properties?');"
sqlQuestion += "INSERT INTO question VALUES ('Is your company a market leader?');"
sqlQuestion += "INSERT INTO question VALUES ('Have there ever been discontent among employees? (caused by layoffs, fusion, relocation etc.)');"
sqlQuestion += "INSERT INTO question VALUES ('Does your company ever suffer for data leaks in the past?');"
sqlQuestion += "INSERT INTO question VALUES ('In your company can every employee have easily access to relevant assets?');"
db.run(sqlQuestion); // Run the query without returning anything
var questionDB = db.exec("SELECT * FROM question");

//db question self assessment
// Aggiungere qui le domande per il self assessment
sqlQuestionSA = "CREATE TABLE questionSA (name char);";
sqlQuestionSA += "INSERT INTO questionSA VALUES ('How many employees are aware of the risks of sharing “personal” or ”work related” things on social networks? (OSINT)');"
sqlQuestionSA += "INSERT INTO questionSA VALUES ('How many employees are able to recognize Social Engineering tricks and react to this threat? (*shing)');"
sqlQuestionSA += "INSERT INTO questionSA VALUES ('How many employees are able to identify and correctly protect sensitive and non-sensitive data? (Manipulating Human Behavior)');"
sqlQuestionSA += "INSERT INTO questionSA VALUES ('What percentage of custom applications has been carried out according to the “Secure Coding” practices? (Fuzzing)');"
sqlQuestionSA += "INSERT INTO questionSA VALUES ('How much legacy network protocols/services are used in the company that not guarantee security features (e.g. authentication, authorization, encryption)? (RE)');"
db.run(sqlQuestionSA); // Run the query without returning anything
var questionSA = db.exec("SELECT * FROM questionSA");

// contiene i threat agent che vengono selezionati durante la compilazione delle tabelle
var currentTA = [];


window.onload = function() {

	if (document.getElementById("companyType")) {
		// genera la tabella del tipo di azienda
		for (var i = 0; i<companyDB[0].values.length; i++) {
			var typeCompany = '<tr><td><div class="form-check"><label class="form-check-label">' +
			'<input class="form-check-input" type="radio" name="radioTypeCompany" id="radioTypeCompany" value="' + i + '">' +
			'</label></div></td><td scope="row">' + companyDB[0].values[i][0] + '</td></tr>';
			document.getElementById("companyType").innerHTML += typeCompany;
		}
	}

	if (document.getElementById("companyDim")) {
		// genera la tabella dimensione azienda
		for (var i = 0; i<companyDB[0].values.length; i++) {
			var dimCompany = '<tr><td><div class="form-check"><label class="form-check-label">' +
			'<input class="form-check-input" type="radio" name="sizeCompRadios" id="sizeCompRadios" value="">' +
			'</label></div></td><td scope="row">' + companyDB[0].values[i][1] + '</td></tr>';
			document.getElementById("companyDim").innerHTML += dimCompany;
		}
	}

	if (document.getElementById("assetCompany")) {
		// genera la tabella degli assets
		for (var i = 0; i<assetDB[0].values.length; i++) {
			var assetCompany = '<tr><td><div><input type="checkbox" id="checkboxAsset' + i + '" class="styled"><label></label></div></td>' + 
			'<td scope="row">' + assetDB[0].values[i] + '</td></tr>';
			document.getElementById("assetCompany").innerHTML += assetCompany;
		}
	}

	if (document.getElementById("containerAsset")) {
		// genera la tabella degli assets
		for (var i = 0; i<assetDB[0].values.length; i++) {
			var assetCompany = '<tr><td><div><select multiple class="form-control" class="styled">' + 
			'<option>Intangible</option><option>Human</option><option>IT</option><option>Physical</option></select><label></label></div></td>' + 
			'<td scope="row">' + assetDB[0].values[i] + '</td></tr>';
			document.getElementById("containerAsset").innerHTML += assetCompany;
		}
	}
	
	if (document.getElementById("goalThreatAgent")) {
		// genera la tabella threat agent / attack goal
		var tmp = 0;
		for (var i = 0; i<threatAgentDB[0].values.length; i++) {
			var goalThreatAgent = '<tr><td>' + threatAgentDB[0].values[i] + '</td>' +
			  '<td><label class="radioCool" style="text-align:center;"><input type="radio" id="checkboxQuestion'+ (tmp+=1) +'" class="styled" disabled><span class="checkmark"></span></label></td>' + 
		      '<td><label class="radioCool" style="text-align:center;"><input type="radio" id="checkboxQuestion'+ (tmp+=1) +'" class="styled" disabled><span class="checkmark"></span></label></td>' +
		      '<td><label class="radioCool" style="text-align:center;"><input type="radio" id="checkboxQuestion'+ (tmp+=1) +'" class="styled" disabled><span class="checkmark"></span></label></td>' +
		      '<td><label class="radioCool" style="text-align:center;"><input type="radio" id="checkboxQuestion'+ (tmp+=1) +'" class="styled" disabled><span class="checkmark"></span></label></td>' +
		      '<td><label class="radioCool" style="text-align:center;"><input type="radio" id="checkboxQuestion'+ (tmp+=1) +'" class="styled" disabled><span class="checkmark"></span></label></td>' +
		      '<td><label class="radioCool" style="text-align:center;"><input type="radio" id="checkboxQuestion'+ (tmp+=1) +'" class="styled" disabled><span class="checkmark"></span></label></td>' +
		      '<td><label class="radioCool" style="text-align:center;"><input type="radio" id="checkboxQuestion'+ (tmp+=1) +'" class="styled" disabled><span class="checkmark"></span></label></td>' +
		      '<td><label class="radioCool" style="text-align:center;"><input type="radio" id="checkboxQuestion'+ (tmp+=1) +'" class="styled" disabled><span class="checkmark"></span></label></td>' +
		      '<td><label class="radioCool" style="text-align:center;"><input type="radio" id="checkboxQuestion'+ (tmp+=1) +'" class="styled" disabled><span class="checkmark"></span></label></td>' +
		      '<td><label class="radioCool" style="text-align:center;"><input type="radio" id="checkboxQuestion'+ (tmp+=1) +'" class="styled" disabled><span class="checkmark"></span></label></td></tr>';
			document.getElementById("goalThreatAgent").innerHTML += goalThreatAgent;
		}
	}

	// Genera le domande per identificare i goals dei threat agents
	if (document.getElementById("questionThreatAgent")) {
		var tmp = 0;
		for (var i = 0; i<questionDB[0].values.length; i++) {
			var questionThreatAgent = '<br><div class="row"><div class="col-md-8">' + questionDB[0].values[i] + '</div>' +
				'<div class="col-md-2"><input class="form-check-input" type="radio" name="radioQuestion'+ i +'" id="radioQuestion'+ (tmp+=1) +'" > No</div>' +
				'<div class="col-md-2"><input class="form-check-input" type="radio" name="radioQuestion'+ i +'" id="radioQuestion'+ (tmp+=1) +'" > Yes</div></div><br>';
			document.getElementById("questionThreatAgent").innerHTML += questionThreatAgent;
		}
	}

	// Genera le domande per identificare i goals dei threat agents
	if (document.getElementById("questionSA")) {
		for (var i = 0; i<questionSA[0].values.length; i++) {
			var questionSelfA = '<br><div>' + questionSA[0].values[i] + '</div>' +
				'<ul>' + 
				'<li><input class="form-check-input" type="radio" name="radioSA'+ i +'" id="radioSA'+ i +'" value="1"> Less than 20%</li>' +
				'<li><input class="form-check-input" type="radio" name="radioSA'+ i +'" id="radioSA'+ i +'" value="2"> Between 20% and 40%</li>' +
				'<li><input class="form-check-input" type="radio" name="radioSA'+ i +'" id="radioSA'+ i +'" value="3"> Between 40% and 60%</li>' +
				'<li><input class="form-check-input" type="radio" name="radioSA'+ i +'" id="radioSA'+ i +'" value="4"> Between 60% and 80%</li>' +
				'<li><input class="form-check-input" type="radio" name="radioSA'+ i +'" id="radioSA'+ i +'" value="5"> Greater than 80%</li>' +
				'</ul>';
			document.getElementById("questionSA").innerHTML += questionSelfA;
		}
	}

	// Genera le domande per identificare i goals dei threat agents
	if (document.getElementById("questionSACiso")) {
		var tmp = 0;
		for (var i = 0; i<questionSA[0].values.length; i++) {
			var questionSelfA = '<br><div>' + questionSA[0].values[i] + '</div>' +
				'<div class="row">' + 
				'<div class="col-sm-4"><ul>' + 
				'<li><input class="form-check-input" type="checkbox" name="radioSACiso'+ (tmp+=1) +'" id="radioSACiso'+ i +'" value="1"> Less than 20%</li>' +
				'<li><input class="form-check-input" type="checkbox" name="radioSACiso'+ (tmp+=1) +'" id="radioSACiso'+ i +'" value="2"> Between 20% and 40%</li>' +
				'<li><input class="form-check-input" type="checkbox" name="radioSACiso'+ (tmp+=1) +'" id="radioSACiso'+ i +'" value="3"> Between 40% and 60%</li>' +
				'<li><input class="form-check-input" type="checkbox" name="radioSACiso'+ (tmp+=1) +'" id="radioSACiso'+ i +'" value="4"> Between 60% and 80%</li>' +
				'<li><input class="form-check-input" type="checkbox" name="radioSACiso'+ (tmp+=1) +'" id="radioSACiso'+ i +'" value="5"> Greater than 80%</li>' +
				'</ul></div>' +
				'<div class="col-sm-8"><textarea class="form-control" rows="5" placeholder="External Audit Notes..."></textarea></div>' 
				'</div>';
			document.getElementById("questionSACiso").innerHTML += questionSelfA;
		}
	}

}