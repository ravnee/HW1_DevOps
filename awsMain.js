var AWS = require('aws-sdk');

AWS.config.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
AWS.config.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
AWS.config.region = 'us-west-2';

var ec2 = new AWS.EC2();

var params = {
  ImageId: 'ami-44da5574', // Amazon Linux AMI x86_64 EBS
  InstanceType: 't2.micro',
  MinCount: 1,
  KeyName: 'ravneet',
  MaxCount: 1
};

ec2.runInstances(params, function(err, data) {

  if (err) { 
    console.log("Could not create ec2 instance", err); 
    return; 
  }

  var instanceId = data.Instances[0].InstanceId;
  console.log("Created instance", instanceId);

  var x = {InstanceIds: [instanceId]};
  setTimeout(function(){
    ec2.describeInstances(x,function (err, data ){
      if (err) console.log(err, err.stack); // an error occurred
      else {
        console.log(data);
        var ipaddr = data.Reservations[0].Instances[0].PublicIpAddress;
        console.log(ipaddr);
        fs = require('fs');
        fs.appendFile('inventory', '[InventoryHostList]\n'+ 'node0 ansible_ssh_host='+ipaddr+' ansible_ssh_user=ec2-user ansible_ssh_private_key_file=ravneet.pem', function (err) {
          if(err) {
                return console.log(err);
            }
            console.log("AWS Changes saved in Inventory File");
          });
        } 
      }
    );
  },15000);
  

  params = {Resources: [instanceId], Tags: [
    {Key: 'ravneet', Value: 'awsVal'}
  ]};

  ec2.createTags(params, function(err) {
    console.log("Tagging instance", err ? "failure" : "success");
  });
});
