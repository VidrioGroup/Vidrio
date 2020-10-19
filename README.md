# Vidrio

New video conferencing app to foster more collaborative and interpersonal connections in virtual classrooms. 

## Installation Instructions 
### Linux
1. Create a free Twilio account to use their video API
2. Generate an API key and store your credentials
3. Clone this repo
4. Open the .env file in a text editor to store your Twilio API credentials 
5. Use Terminal to create a virtual environment to install the necessary packages and libraries using the following commands:
```
python3 -m venv venv
. venv/bin/activate
```
6. Install required libraries and packages into your virtual env
```
pip3 install -r requirements.txt
```
7. Run the Python script to launch your app!
```
python app.py
```
8. A local host http://0.0.0.0:5000/ is created so you can access your app on your local machine in a web browser, but in order to share the link with other users so they can access the video chat, you can download ngrok to host your website for you (a unique URL is generated every time). 
9. To run your app using ngrok, just download the package from their website, open a new terminal window (while the python app.py is still executing in another window), and activate your virtual environment that was created before:
```
. venv/bin/activate
```
10. To generate the ngrok URL, type the following command:
```
ngrok http 5000
```
11. Copy and paste the https URL in a web browser and start video chatting!
