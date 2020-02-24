from flask import Flask, jsonify, abort, make_response, request
from pymongo import MongoClient
import pprint
import datetime


app = Flask(__name__)


mongoCli = MongoClient()
db = mongoCli.chat_server
db_messages = db.message

messages = [
        {
            'id':1,
            'sender':'kabelo',
            'receiver':'leano',
            'message':'hello world'
            }
        ]


#INDEX ROUTE
@app.route('/')
def index():
    return "... WELCOME TO M-COM ..."

#gets all messages
@app.route('/chat/api/v1.0/messages', methods=['GET'])
def get_all_messages():
    return jsonify({'messages' : messages})

#gets messages by sender
@app.route('/chat/api/v1.0/sender_messages/<int:sender_id>', methods=['GET'])
def get_sender_messages(sender_id):
    message = [message for message in messages if message['id'] == sender_id]
    if len(message) == 0:
        abort(404)
    return jsonify({'messages': message[0]})

#does handshake to check if server is running
@app.route('/chat/api/v1.0/handshake', methods=['GET'])
def _handshake():
    return "\n--- 200 OK ---\n--- Server Running! ---\n"


#send message
@app.route('/chat/api/v1.0/send_message',methods=['POST'])
def send_message():
    if not request.json or not 'sender' in request.json:
        abort(400)
    msg_id = messages[-1]['id'] + 1
    message = {
            'id':msg_id,
            'sender':request.json['sender'],
            'receiver':request.json['receiver'],
            'message':request.json['message']
            }
    message_id = db_messages.insert_one(message).inserted_id
    return "\n200 -- Message Sent --\n"


#error handling
#404
@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error':'Not Found'}),404)



if __name__ == '__main__':
    app.run(debug=True)
