/**
 * Created by gilberto on 02/06/16.
 */
import { Mongo } from 'meteor/mongo';

//tasks vai representar uma "entidade" a ser persistida no Mongo DB
export const Tasks = new Mongo.Collection('tasks');