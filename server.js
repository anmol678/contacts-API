var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;

var contacts = [];

app.use(bodyParser.json());

// GET /
app.get('/', function(req, res) {
	res.send('Contacts Root');
});

// GET /contacts
// add queries
app.get('/contacts', function(req, res) {
	var queryParams = req.query;
	var filteredContacts = contacts;

	if (queryParams.hasOwnProperty('name')) {
		if (_.isString(queryParams.name) && queryParams.name.trim().length > 0)
			filteredContacts = _.filter(filteredContacts, function(contact) {
				return contact.name.toLowerCase().indexOf(queryParams.name.toLowerCase()) > -1;
			});
		else
			return res.status(400).send();
	}

	if (queryParams.hasOwnProperty('number')) {
		if (!_.isNaN(queryParams.number * 1))
			filteredContacts = _.filter(filteredContacts, function(contact) {
				return (contact.mobile.toString().indexOf(queryParams.mobile) > -1 || contact.home.toString().indexOf(queryParams.home) > -1 || contact.work.toString().indexOf(queryParams.work) > -1);
			});
		else
			return res.status(400).send();
	}

	if (queryParams.hasOwnProperty('email')) {
		if (_.isString(queryParams.email))
			filteredContacts = _.filter(filteredContacts, function(contact) {
				return contact.email.toLowerCase().indexOf(queryParams.email.toLowerCase()) > -1;
			});
		else
			return res.status(400).send();
	}

	if (_.isEmpty(filteredContacts))
		return res.status(404).send();
	else
		res.json(filteredContacts);
});

// GET /contacts/:name
app.get('/contacts/:name', function(req, res) {
	var contactName = req.params.name.trim();
	var matchedContact = _.findWhere(contacts, {
		name: contactName
	});

	if (!matchedContact)
		return res.status(404).send();
	else
		res.json(matchedContact);
});

// POST /contacts
app.post('/contacts', function(req, res) {
	var body = _.pick(req.body, 'name', 'mobile', 'home', 'work', 'email');

	if (!_.isString(body.name) || body.name.trim().length === 0 || !_.isNumber(body.mobile) || body.mobile.toString().length < 7 || !_.isNumber(body.home) || body.home.toString().length < 7 || !_.isNumber(body.work) || body.work.toString().length < 7 || !_.isString(body.email) || body.email.length < 6)
		return res.status(400).send();

	contacts.push(body);
	contacts = _.sortBy(contacts, 'name');

	res.json(body);
});

// DELETE /contacts/:name
app.delete('/contacts/:name', function(req, res) {
	var contactName = req.params.name.trim();
	var matchedContact = _.findWhere(contacts, {
		name: contactName
	});

	if (!matchedContact)
		return res.status(404).send();
	else {
		contacts = _.without(contacts, matchedContact);
		res.json(matchedContact);
	}
});

// PUT /contacts/:name
app.put('/contacts/:name', function(req, res) {
	var contactName = req.params.name.trim();
	var matchedContact = _.findWhere(contacts, {
		name: contactName
	});

	var body = _.pick(req.body, 'name', 'mobile', 'home', 'work', 'email');
	var validAttributes = {};

	if (!matchedContact)
		return res.status(404).send();

	if (body.hasOwnProperty('name')) {
		if (_.isString(body.name) && body.name.trim().length > 0)
			validAttributes.name = body.name;
		else
			return res.status(400).send();
	}

	if (body.hasOwnProperty('mobile')) {
		if (_.isNumber(body.mobile) && body.mobile.toString().length > 6)
			validAttributes.mobile = body.mobile;
		else if (body.mobile === 'delete')
			delete matchedContact.mobile;
		else
			return res.status(400).send();
	}

	if (body.hasOwnProperty('home')) {
		if (_.isNumber(body.home) && body.home.toString().length > 6)
			validAttributes.home = body.home;
		else if (body.home === 'delete')
			delete matchedContact.home;
		else
			return res.status(400).send();
	}

	if (body.hasOwnProperty('work')) {
		if (_.isNumber(body.work) && body.work.toString().length > 6)
			validAttributes.work = body.work;
		else if (body.work === 'delete')
			delete matchedContact.work;
		else
			return res.status(400).send();
	}

	if (body.hasOwnProperty('email')) {
		if (_.isString(body.email) && body.email.length > 5)
			validAttributes.email = body.email;
		else if (body.email === 'delete')
			delete matchedContact.email;
		else
			return res.status(400).send();
	}

	_.extend(matchedContact, validAttributes);
	res.json(matchedContact);

});

app.listen(PORT, function() {
	console.log('Express listening on port ' + PORT);
});