//Initializing express router
const router_P = require('express').Router();
const router_UP= require('express').Router();
const auth = require("../authentication/authenticate");
const authenticate=auth.authenticate;

//Importing controller
const MeetController = require("../controller/meetController");

//set default API response
router_UP.get('/', function(req, res) 
{
    res.json(
    {
        status: 'API Works',
        message: 'Welcome to MEET SCHEDULER API'
    });
});

// 1 st option to route with authentication

router_P.use(authenticate)
router_UP.route('/Register')
    .post(MeetController.addNewUser);
router_UP.route('/Login/')
    .post(MeetController.getUser);
//router.route('/Meets/FilterMeeting/',authenticate)
router_P.route('/FilterMeeting/')
    .get(MeetController.Filtermeeting);
router_P.route('/Addnewmeeting')
    .post(MeetController.addNewMeeting);
router_P.route('/Addattendes/')
    .post(MeetController.addAttendes);
router_P.route('/removeattendes/')
    .post(MeetController.removeAttendes);
router_P.route('/calender')
    .get(MeetController.showcalender);

// 2 nd options to use route with authentication
/*
router_UP.post('/Register',MeetController.addNewUser);
router_UP.post('/Login/',MeetController.getUser);
//router.route('/Meets/FilterMeeting/',authenticate)
router_P.get('/FilterMeeting/',auth,MeetController.Filtermeeting);
router_P.post('/Addnewmeeting',auth,MeetController.addNewMeeting);
router_P.post('/Addattendes/',auth,MeetController.addAttendes);
router_P.post('/removeattendes/',auth,MeetController.removeAttendes);
router_P.get('/calender',auth,MeetController.showcalender);
*/

//Export API routes

module.exports = {
    protected: router_P,
    unprotected: router_UP
};