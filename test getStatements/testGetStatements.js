function view() {

	TinCan.enableDebug();
	//lrs connexion
	var lrs;

	try {
		lrs = new TinCan.LRS(
			{
				endpoint: "x",
				username: "x",
				password: "x",
				allowFail: false
			}
		);
	}
	catch (ex) {
		console.log("Echec lors de l'initialisation du LRS : " + ex);
	}

	var mesFiltres = {
		//agent: new TinCan.Agent({mbox: "fronzoni@itop.fr"}),
		//verb: new TinCan.Verb({id: "http://adlnet.gov/expapi/verbs/experienced"}),
		//activity: new TinCan.Activity({ id: "http://id.mondomaine.com/activity/ressource/test-acces-ressource"}),
		//since: "2016-09-28T11:30:00Z", //Narrative 2nd video
		//until: "2016-09-28T12:30:00Z",
		//since: "2016-09-28T10:00:00Z", //narrative
		//until: "2016-09-28T10:50:00Z",
		since: "2016-09-08T13:00:00Z", //leonard de rubiela (avec des traces client)
		until: "2016-09-08T13:50:00Z",
		//since: "2016-07-28T00:00:00Z",
		//until: "2016-07-29T00:00:00Z",		
		//since: "2016-07-28T08:40:00Z", session rubiela
		//until: "2016-07-28T09:30:00Z",		
		//since: "2016-07-28T13:50:00Z",//session yannick
		//until: "2016-07-28T14:13:12Z",		
		//since: "2016-07-28T15:16:00Z", //session elise
		//until: "2016-07-28T15:37:00Z",		
		ascending: true,
		limit: 25
	} ;
	//var email = $("#tiEmail").val();
	//var activity = $("#tiActivity").val();

	//if(email !== "") {
	//	mesFiltres.agent = new TinCan.Agent({ mbox: email });
	//}
	//if(activity !== "") {
	//	mesFiltres.activity = new TinCan.Activity({ id: activity });
	//}
	function treatStatements(sr){
		//var statementString = "<table>";
		var statementString = "<table><tr><td>stored time</td><td>timestamp</td><td>actor name</td><td>verb id</td><td>verb fr-FR</td><td>object id</td><td>object fr-FR</td></tr>";
		for(var i=0; i<sr.statements.length; i++) {
			statementString +=	"<tr><td>" + sr.statements[i].stored +
			"</td><td>" + sr.statements[i].timestamp +
			"</td><td>" + sr.statements[i].actor.name +
			"</td><td>" + sr.statements[i].verb.id +
			"</td><td>" + sr.statements[i].verb.display["fr-FR"] +
			"</td><td>" + sr.statements[i].target.id +
			"</td><td>" + sr.statements[i].target.definition.name["fr-FR"] + "</td></tr>";
		}
		statementString += "</table>";
		document.getElementById("numStatementsFor").innerHTML = statementString;
		document.getElementById("numStatementsLength").innerHTML = " Number of statements : " + sr.statements.length;
	}
	var appels=0;
	

//************************

	function getMoreStatements(srmore){
			
			console.log("Appel number: " + appels);

			if (srmore.more!==null ) {
					if (srmore.more!==""){
						appels++;
						console.log("more statements : " + srmore.more);
						lrs.moreStatements({url: "/public"+srmore.more, callback:function(err,srmoremore){
							if (err !== null) {
								console.log("Echec lors de la récupération de statements : " + err);
								return;
							}
							addStatements(srmore,srmoremore);

						}});

					}

			}
			if (appels==0){
				treatStatements(srmore);
			}
		}

	function addStatements(sr,srmore){
		appels--;
		sr.statements=sr.statements.concat(srmore.statements);
		sr.more=srmore.more;
		//document.getElementById("numStatementsLength").innerHTML = " Number of statements : " + sr.statements.length +"<br> Getting additional statements, please wait...";
		document.getElementById("numStatementsLength").innerHTML = " Number of statements : " + sr.statements.length;
		getMoreStatements(sr);
	}

//**************************

	function queryLRS(err,sr) {
		if (err !== null) {
			console.log("Echec lors de la récupération de statements : " + err);
			return;
		}

		getMoreStatements(sr);
		
	}
	//document.getElementById("numStatementsLength").innerHTML = "Getting statements, please wait...";
	lrs.queryStatements({params: mesFiltres,
		callback: function(err,sr){
		queryLRS(err,sr);
	}});
}
