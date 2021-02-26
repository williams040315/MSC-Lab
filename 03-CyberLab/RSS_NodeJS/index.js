/**
 * Institut Curie, UMR 168
 *
 * This program will automatically scan a RSS feed and send new articles to a Teams channel
 *
 * @summary RSS parser, formater and sender to Teams
 * @author Pierre-Louis Crescitz <pierrelouis.crescitz@gmail.com>
 *
 * Created at     : 2020-09-29 @L'heure du café 
 * Last modified  : 2020-09-30 @Quand ça a marché
 */

let RSS_URL = "https://phys.org/rss-feed/biology-news/";
let REFRESH_TIME_IN_MS = 30000;

let Parser = require('rss-parser');
const request = require('sync-request');
let parser = new Parser({
    customFields: {
	item: [
	    ['media:content', 'media:content', 'media:thumbnail', {keepArray: true}],
	]
    }
});

let lastTitle = "first";

function sendNewArticleToTeams(lastArticle)
{
    try {
	var resultat = request('POST', 'https://outlook.office.com/webhook/1e6ce243-d98d-4200-99a0-ef9eb483a885@183ad437-6002-48ad-8886-c5885ce9be1a/IncomingWebhook/b9152cea1c2f4391adb28ec14e0d89ab/66594a77-b4fc-4eed-86ff-602e26a6d928', {
	    headers: {
		'Content-Type': 'application/json'
	    },
	//    timeout: 500,
	    /*json: {
		text: '<h1><a href="' + lastArticle.link + '">' + lastArticle.title + '</a></h1><p>'+lastArticle.contentSnippet+'</p>'
		},*/
		json: {
			"@type": "MessageCard",
			"@context": "http://schema.org/extensions",
			"themeColor": "0076D7",
			"summary": lastArticle.title,
			"sections": [{
				"activityTitle": "![TestImage](https://47a92947.ngrok.io/Content/Images/default.png)"+lastArticle.title+"",
				"activitySubtitle": "Article from Phys.org",
				"activityImage": "https://teamsnodesample.azurewebsites.net/static/img/image5.png",
				"facts": [{
					"name": "Publication date",
					"value": lastArticle.pubDate
				}, {
					"name": "Categorie",
					"value": lastArticle.categories[0]
				}, {
					"name": "Content snippet",
					"value": lastArticle.content
				}],
				"markdown": true
			}],
			"potentialAction": [{
				"@type": "OpenUri",
				"name": "View article",
				"targets": [
					{
						"os": "default",
						"uri": lastArticle.link
					}
				]
			}]
		},
	});
    }
    catch (error) {
	console.log(error);
    }
    console.log("New article sent to Teams.\n");
    return ("done");
}

function fetchRSS_PhysOrg()
{
    console.log("Checking for new article...");
    (async () => {
	let feed = await parser.parseURL(RSS_URL);
	let lastArticle = feed.items[0];
	console.log(lastArticle);
	sendNewArticleToTeams(lastArticle);
	return ("done");
	if (lastTitle == "first") {
	    lastTitle = lastArticle.title;
//	    sendNewArticleToTeams(lastArticle);
	}
	else if (lastTitle != lastArticle.title) {
	    console.log("New article found!");
	    var tmpLastTitle = lastTitle
	    lastTitle = lastArticle.title;
	    for (var j = 0; feed.items[j].title != tmpLastTitle; j++) {
			sendNewArticleToTeams(feed.items[j]);
	    }
	}
	else {
	    console.log("No new article found.\n");
	}
 	
    })();
}

function fetchRSS_Nature() {
    (async () => {
	let feed = await parser.parseURL(RSS_URL);
	console.log(feed);

	})();
}

//fetchRSS_PhysOrg();
fetchRSS_Nature();
//console.log("Welcome to this RSS handler !\nThe RSS feed selected is " + RSS_URL + "\nAnd will be refreshed every " + REFRESH_TIME_IN_MS + " ms\n");
//setInterval(function(){fetchRSS();}, REFRESH_TIME_IN_MS);
