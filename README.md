# HW1_DevOps
DevOps Homework 1


## Steps taken

Script Files for   
DigitalOcean - digitalOceanMain.js  
AWS - awsMain.js  
Wrapper Script - mainScript.js  
Playbook for ansible - playbook.yml

1. List all the dependencies in package.json and install them using  
  ```
  npm install
  ```

2. Run the main script that will internally call both the Digital Ocean and AWS script
  ```
  node mainScript.js
  ```

3. Check that instances are created on both the server providers in web browser- Digital Ocean and AWS. Also Inventory file should be updated with the host details.

4. Ping the two servers using ansible to check if it is active.
  ```
  ansible all -m ping -i inventory -vvvv
  ```

5. install nginx webserver on both servers using playbook
  ```
  ansible-playbook -i inventory playbook.yml -vvvv
  ```

# Screencast
![hw1](https://cloud.githubusercontent.com/assets/8634231/9923614/0bbe1df6-5cc5-11e5-844f-65b9124abf82.gif)
