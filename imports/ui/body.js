//import { Template } from 'meteor/templating';
//
////Aqui você diz qual é o HTML que o JS será utilizado
//import './body.html';
//
//Template.body.helpers({
//    tasks: [
//        { text: 'This is task 1' },
//        { text: 'This is task 2' },
//        { text: 'This is task 3' },
//    ],
//});

//Configuração para inserir no Mondo DB
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Tasks } from '../api/tasks.js';//Trabalha com o conteúdo do Mongo DB

import './task.js';

//Aqui você diz qual é o HTML que o JS será utilizado
import './body.html';

Template.body.onCreated(function bodyOnCreated() {
    this.state = new ReactiveDict();
});

Template.body.helpers({
    tasks() {
        //return Tasks.find({});

        //filtra pelas tarefas não consluídas
        const instance = Template.instance();
        if (instance.state.get('hideCompleted')) {
            // If hide completed is checked, filter tasks
            return Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
        }
        // Otherwise, return all of the tasks

        //retorna os dados ordenados pela data de criação
        return Tasks.find({}, { sort: { createdAt: -1 } });
    },
    incompleteCount() {
        return Tasks.find({ checked: { $ne: true } }).count();
    },
});

//Alterado para permitir a inclusão de novos dados fornecidos pelo usuário
//quando o form do body.html, que está com a classe "new-task", for submetido, irá persistir os dados no Mongo DB
Template.body.events({
    'submit .new-task'(event) {
        // Prevent default browser form submit
        event.preventDefault();

        // Get value from form element
        const target = event.target;
        const text = target.text.value;

        // Insert a task into the collection
        Tasks.insert({
            text,
            createdAt: new Date(), // current time
            owner: Meteor.userId(),
            username: Meteor.user().username,
        });

        // Insert a task into the collection
        Meteor.call('tasks.insert', text);

        // Clear form
        target.text.value = '';
    },
    'change .hide-completed input'(event, instance) {
        instance.state.set('hideCompleted', event.target.checked);
    },
});