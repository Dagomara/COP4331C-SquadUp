const expect = require('chai').expect;
const request = require('request');
const app = require('../../../api.js');
const conn = require('../../db/connect.js');
const router = require("../routes/api");

describe('unit tests', ()=>{

	it('Edit Profile Test', () => {

		const payload = {
			discordID : "179717105585573115",
			username : "Seemore",
			gender : "Male",
			school : "BCC"
			}
		
		router.patch('/editProfile', { 
			payload 
		}, (_, responce) => { 
			expect(responce.statusCode).to.equal(200)
		})	
	})

	it('Edit Profile Test FAIL', () => {

		const payload = {
			discordID : "XXXXXXXXXXXXXXXXXX",
			username : "Seemore",
			gender : "Male",
			school : "BCC"
			}
		
		router.patch('/editProfile', { 
			payload 
		}, (_, responce) => { 
			expect(responce.statusCode).to.equal(400)
		})	
	})

	it('View Profile Test', () => {

		const payload = {
			discordID : "179717105585573115"
			}
		
		router.post('/editProfile', { 
			payload 
		}, (_, responce) => { 
			expect(responce.statusCode).to.equal(200)
		})	
	})

	it('View Profile Test FAIL', () => {

		const payload = {
			discordID : "XXXXXXXXXXXXXXXXXX"
			}
		
		router.post('/editProfile', { 
			payload 
		}, (_, responce) => { 
			expect(responce.statusCode).to.equal(400)
		})	
	})

	it('Add Game Test', () => {

		const payload = {
			discordID : "179717105585573115",
			game :{
      			"gameID": 1,
      			"level": "platnum",
      			"positions": [
      			  "botlane"
      			],
      			"characters": [
       			 "Viego",
				  "Sona",
				  "Nilah"
      			]
    				}
			}
		
		router.post('/addGame', { 
			payload 
		}, (_, responce) => { 
			expect(responce.statusCode).to.equal(200)
		})	
	})

	it('Add Game Test FAIL', () => {

		const payload = {
			discordID : "XXXXXXXXXXXXXXXXXX",
			game :{
      			"gameID": 1,
      			"level": "platnum",
      			"positions": [
      			  "botlane"
      			],
      			"characters": [
       			 "Viego",
				  "Sona",
				  "Nilah"
      			]
    				}
			}
		
		router.post('/addGame', { 
			payload 
		}, (_, responce) => { 
			expect(responce.statusCode).to.equal(400)
		})	
	})

	it('Delete Game Test', () => {

		const payload = {
			discordID : "179717105585573115",
			game :{
      			"gameID": 1,
      			"level": "platnum",
      			"positions": [
      			  "botlane"
      			],
      			"characters": [
       			 "Viego",
				  "Sona",
				  "Nilah"
      			]
    				}
			}
		
		router.post('/deleteGame', { 
			payload 
		}, (_, responce) => { 
			expect(responce.statusCode).to.equal(200)
		})	
	})

	it('Delete Game Test FAIL', () => {

		const payload = {
			discordID : "XXXXXXXXXXXXXXXXXX",
			game :{
      			"gameID": 1,
      			"level": "platnum",
      			"positions": [
      			  "botlane"
      			],
      			"characters": [
       			 "Viego",
				  "Sona",
				  "Nilah"
      			]
    				}
			}
		
		router.post('/deleteGame', { 
			payload 
		}, (_, responce) => { 
			expect(responce.statusCode).to.equal(400)
		})	
	})

	it('Edit Game Test', () => {

		const payload = {
			discordID : "179717105585573115",
			game :{
    				  "gameID": 2,
    				  "level": 150,
    				  "positions": [
     				   "attack"
    				  ],
     				 "characters": [
     				   "pyro"
    				  ]
    				}
			}
		
		router.post('/editGame', { 
			payload 
		}, (_, responce) => { 
			expect(responce.statusCode).to.equal(200)
		})	
	})

	it('Edit Game Test FAIL', () => {

		const payload = {
			discordID : "XXXXXXXXXXXXXXXXXX",
			game :{
    				  "gameID": 2,
    				  "level": 150,
    				  "positions": [
     				   "attack"
    				  ],
     				 "characters": [
     				   "pyro"
    				  ]
    				}
			}
		
		router.post('/editGame', { 
			payload 
		}, (_, responce) => { 
			expect(responce.statusCode).to.equal(400)
		})	
	})

	it('View Games Test', () => {

		const payload = {
			discordID : "179717105585573115"
			}
		
		router.post('/viewGames', { 
			payload 
		}, (_, responce) => { 
			expect(responce.statusCode).to.equal(200)
		})	
	})

	it('View Games Test FAIL', () => {

		const payload = {
			discordID : "XXXXXXXXXXXXXXXXXX"
			}
		
		router.post('/viewGames', { 
			payload 
		}, (_, responce) => { 
			expect(responce.statusCode).to.equal(400)
		})	
	})

	it('goOnline Test', () => {

		const payload = {
			discordID : "179717105585573115"
			}
		
		router.post('/goOnline', { 
			payload 
		}, (_, responce) => { 
			expect(responce.body.status).to.equal("Online")
		})	
	})

	it('goOnline Test FAIL', () => {

		const payload = {
			discordID : "XXXXXXXXXXXXXXXXXX"
			}
		
		router.post('/goOnline', { 
			payload 
		}, (_, responce) => { 
			expect(responce.statusCode).to.equal(400)
		})
	})

	it('goOffline Test', () => {

		const payload = {
			discordID : "179717105585573115"
			}
		
		router.post('/goOffline', { 
			payload 
		}, (_, responce) => { 
			expect(responce.body.status).to.equal("Offline")
		})	
	})

	it('goOnline Test FAIL', () => {

		const payload = {
			discordID : "XXXXXXXXXXXXXXXXXX"
			}
		
		router.post('/goOnline', { 
			payload 
		}, (_, responce) => { 
			expect(responce.statusCode).to.equal(400)
		})
	})

	it('Add Friend Test', () => {

		const payload = {
			discordID : "179717105585573115",
			friends : "179717105585573116"
			}
		
		router.post('/addFriend', { 
			payload 
		}, (_, responce) => { 
			expect(responce.statusCode).to.equal(200)
		})	
	})

	it('Add Friend Test FAIL', () => {

		const payload = {
			discordID : "XXXXXXXXXXXXXXXXXX",
			friends : "179717105585573116"
			}
		
		router.post('/goOnline', { 
			payload 
		}, (_, responce) => { 
			expect(responce.statusCode).to.equal(400)
		})
	})

	it('Delete Friend Test', () => {

		const payload = {
			discordID : "179717105585573115",
			friends : "179717105585573116"
			}
		
		router.post('/deleteFriend', { 
			payload 
		}, (_, responce) => { 
			expect(responce.statusCode).to.equal(200)
		})	
	})

	it('Delete Friend Test FAIL', () => {

		const payload = {
			discordID : "XXXXXXXXXXXXXXXXXX",
			friends : "179717105585573116"
			}
		
		router.post('/deleteFriend', { 
			payload 
		}, (_, responce) => { 
			expect(responce.statusCode).to.equal(400)
			
		})
	})

	it('View Friends Test', () => {

		const payload = {
			discordID : "179717105585573115"
			}
		
		router.post('/viewFriends', { 
			payload 
		}, (_, responce) => { 
			expect(responce.statusCode).to.equal(200)
			
		})	
	})

	it('View Friends Test FAIL', () => {

		const payload = {
			discordID : "XXXXXXXXXXXXXXXXXX"
			}
		
		router.post('/viewFriends', { 
			payload 
		}, (_, responce) => { 
			expect(responce.statusCode).to.equal(400)
			
		})
	})

	it('Add Blocked Test', () => {

		const payload = {
			discordID : "179717105585573115",
			friends : "179717105585573116"
			}
		
		router.post('/addBlocked', { 
			payload 
		}, (_, responce) => { 
			expect(responce.statusCode).to.equal(200)
			
		})	
	})

	it('Add Blocked Test FAIL', () => {

		const payload = {
			discordID : "XXXXXXXXXXXXXXXXXX",
			friends : "179717105585573116"
			}
		
		router.post('/addBlocked', { 
			payload 
		}, (_, responce) => { 
			expect(responce.statusCode).to.equal(400)
			
		})
	})

	it('Delete Blocked Test', () => {

		const payload = {
			discordID : "179717105585573115",
			friends : "179717105585573116"
			}
		
		router.post('/deleteBlocked', { 
			payload 
		}, (_, responce) => { 
			expect(responce.statusCode).to.equal(200)
			
		})	
	})

	it('Delete Blocked Test FAIL', () => {

		const payload = {
			discordID : "XXXXXXXXXXXXXXXXXX",
			friends : "179717105585573116"
			}
		
		router.post('/deleteBlocked', { 
			payload 
		}, (_, responce) => { 
			expect(responce.statusCode).to.equal(400)
			
		})
	})

	it('View Blocked Test', () => {

		const payload = {
			discordID : "179717105585573115"
			}
		
		router.post('/viewBlocked', { 
			payload 
		}, (_, responce) => { 
			expect(responce.statusCode).to.equal(200)
			
		})	
	})

	it('View Blocked Test FAIL', () => {

		const payload = {
			discordID : "XXXXXXXXXXXXXXXXXX"
			}
		
		router.post('/viewBlocked', { 
			payload 
		}, (_, responce) => { 
			expect(responce.statusCode).to.equal(400)
			
		})
	})
})