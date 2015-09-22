var needle = require("needle");
var os   = require("os");

var config = {};

config.token = process.env.DIGITAL_OCEAN_TOKEN;


var headers =
{
	'Content-Type':'application/json',
	Authorization: 'Bearer ' + config.token
};

var client =
{
	listRegions: function( onResponse )
	{
		needle.get("https://api.digitalocean.com/v2/regions", {headers:headers}, onResponse)
	},

	listImages: function( onResponse )
	{
		needle.get("https://api.digitalocean.com/v2/images", {headers:headers}, onResponse)
	},

	listKeyId: function( onResponse )
	{
		needle.get("https://api.digitalocean.com/v2/account/keys", {headers:headers}, onResponse)
	},
	dropletDetail: function( dropletId, onResponse )
	{
		needle.get("https://api.digitalocean.com/v2/droplets/"+dropletId,{headers:headers}, onResponse)
	},

	deleteDroplet: function(dropletId, onResponse)
	{
		needle.delete("https://api.digitalocean.com/v2/droplets/6918702",null,{headers:headers}, onResponse)
	},

	createDroplet: function (dropletName, region, imageName, onResponse)
	{
		var data = 
		{ 
			"name": dropletName,
			"region":region,
			"size":"512mb",
			"image":imageName,
			// Id to ssh_key already associated with account.
			"ssh_keys":[1356100],
			//"ssh_keys":null,
			//"ssh_k"
			"backups":false,
			"ipv6":false,
			"user_data":null,
			"private_networking":null
		};

		console.log("Attempting to create: "+ JSON.stringify(data) );
		needle.post("https://api.digitalocean.com/v2/droplets", data, {headers:headers,json:true}, onResponse );
	}
};


/*
	client.listKeyId(function(error,response)
	{
		console.log(response.body);
	});
*/

// #############################################
// #1 Print out a list of available regions
// Comment out when completed.
// https://developers.digitalocean.com/#list-all-regions
// use 'slug' property
/*client.listRegions(function(error, response)
{
	var data = response.body;
	//console.log( JSON.stringify(response.body) );

	if( response.headers )
	{
		console.log( "Calls remaining", response.headers["ratelimit-remaining"] );
	}

	if( data.regions )
	{
		console.log("Available Data centers");
		for(var i=0; i<data.regions.length; i++)
		{
			console.log(data.regions[i].slug);
		}
	}
});*/


// #############################################
// #2 Extend the client object to have a listImages method
// Comment out when completed.
// https://developers.digitalocean.com/#images
// - Print out a list of available system images, that are AVAILABLE in a specified region.
// - use 'slug' property
/*client.listImages(function(error, response)
{
	var data = response.body;
	console.log("listImages");
	//console.log(JSON.stringify(response.body) );

	if( data.images )
	{
		console.log("Available Images");
		for(var i=0; i<data.images.length; i++)
		{
			console.log(data.images[i].slug + " regions are "+ data.images[i].regions);
		}
	}
});*/

// #############################################
// #3 Create an droplet with the specified name, region, and image
// Comment out when completed. ONLY RUN ONCE!!!!!
// Write down/copy droplet id.
   var name = "ravnee"+os.hostname();
   var region = "nyc2"; // Fill one in from #1
   var image = "centos-6-5-x64"; // Fill one in from #2
   var dropletId = 0;
	client.createDroplet(name, region, image, function(err, resp, body)
	{
		//console.log(body);
		// StatusCode 202 - Means server accepted request.
		if(!err && resp.statusCode == 202)
		{
			//console.log( JSON.stringify( body, null, 3 ) );
			dropletId = body.droplet.id;
			//console.log(dropletId);
			setTimeout(function(){
				client.dropletDetail(dropletId, function(error, response)
				{
					var data = response.body;
					//console.log("dropletDetail");
					//console.log(JSON.stringify(response.body) );
					if(data.droplet.networks.v4)
					{
						var dropletIp = data.droplet.networks.v4[0].ip_address;
						console.log(dropletIp);
						var fs = require('fs');
						fs.appendFile('inventory', "\nnode1 ansible_ssh_host="+dropletIp+" ansible_ssh_user=root", function (err) {
							if(err) {
						        return console.log(err);
						    }
						    console.log("Digital Ocean Changes saved in Inventory File");
						});
						// fs.writeFile("inventory", "[ipaddress]\n"+JSON.stringify(dropletIp), function(err) {

						//     if(err) {
						//         return console.log(err);
						//     }
						//     console.log("The file was saved!");
						// }); 
					}
				});
			},20000);
		}
	}); 

// #############################################
// #4 Extend the client to retrieve information about a specified droplet.
// Comment out when done.
// https://developers.digitalocean.com/#retrieve-an-existing-droplet-by-id
// REMEMBER POST != GET
// Most importantly, print out IP address!
/*   var dropletId = "6879412";
	client.dropletDetail(dropletId, function(error, response)
	{
		var data = response.body;
		console.log("dropletDetail");
		//console.log(JSON.stringify(response.body) );
		if(data.droplet.networks.v4)
		{
			for(var i=0; i<data.droplet.networks.v4.length; i++)
			{
				console.log(data.droplet.networks.v4[i].ip_address);
			}
		}
	});*/

// #############################################
// #5 In the command line, ping your server, make sure it is alive!
//	ping 162.243.168.19

// #############################################
// #6 Extend the client to DESTROY the specified droplet.
// Comment out when done.
// https://developers.digitalocean.com/#delete-a-droplet
// HINT, use the DELETE verb.
// HINT #2, needle.delete(url, data, options, callback), data needs passed as null.
// No response body will be sent back, but the response code will indicate success.
// Specifically, the response code will be a 204, which means that the action was successful with no returned body data.

/* 	var dropletId = "6879412";
	client.deleteDroplet(dropletId, function(err, response)
	{
		console.log("Deleting");
		if(!err && response.statusCode == 204)
		{
				console.log("Deleted!");
		}
	});*/
	

// #############################################
// #7 In the command line, ping your server, make sure it is dead!
// ping xx.xx.xx.xx
// It could be possible that digitalocean reallocated your IP address to another server, so don't fret it is still pinging.
