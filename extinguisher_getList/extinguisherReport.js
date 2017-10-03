/**
* RunScript: JavaScript runscript is used to run script.
* You should return message object
* The input arguments of the script is message. 
*/

//User input preparation
var site = message.body.site;
var region = message.body.region;
var start_date = message.body.start_date;
var end_date = message.body.end_date;
var task_status_cl = message.body.task_status_cl;
var start = "0";
var limit = "1000";

var input = new Message();
var temp = new Message();
var cont = 0;

input.body = {};
input.body.id_pm_infra = site;
input.body.region = region;
input.body.start_time_infra = start_date;
input.body.end_time_infra = end_date;
input.body.task_status_cl = task_status_cl;
input.body.start = start;
input.body.limit = limit;

//Query to Infrastructure checklist data table

var res = CloudServiceAccessor.process("servicecreator.service.FLM_checklist.flmc_pm_infra_model_getList",input);

var report = new Message();
report.body = {};
report.body.results = [];

//make a query by each regster obtained before if any of this has a list of extinguishers

for(var i = 0; i<res.body.results.length; i++){
  
  //We add the data of the first table
	input = new Message();
  	input.body = {};
  	input.body.start = start;
  	input.body.limit = limit;
  	input.body.id_pm_infra = res.body.results[i].id_pm_infra;
  	
 	temp = CloudServiceAccessor.process("servicecreator.service.FLM_Checklist.flmc_extinguisher_getList",input);
  	
    //We add the data of the extinguisher table to the final result
    //For the excel export we have to validate all the field that not return trash values
  	for(var j = 0; j < temp.body.results.length; j++){
      	report.body.results[cont] = {};
        report.body.results[cont].checklist_id = res.body.results[i].id_pm_infra;
        report.body.results[cont].site = (res.body.results[i].site_infra != undefined) ? res.body.results[i].site_infra: "";
        report.body.results[cont].region = (res.body.results[i].region != undefined) ? res.body.results[i].region: "";
      	report.body.results[cont].arrive_time_infra = (res.body.results[i].arrive_time_infra != undefined) ? res.body.results[i].arrive_time_infra: "";
      
  		report.body.results[cont].agent_capacity = (temp.body.results[j].agent_capacity != undefined) ? temp.body.results[j].agent_capacity: "";
      	report.body.results[cont].checklist_id = (temp.body.results[j].checklist_id != undefined) ? temp.body.results[j].checklist_id: "";
  		report.body.results[cont].factor_psq = (temp.body.results[j].factor_psq != undefined) ? temp.body.results[j].factor_psq: "";
  		report.body.results[cont].id_extinguisher = (temp.body.results[j].id_extinguisher != undefined) ? temp.body.results[j].id_extinguisher: "";
  		report.body.results[cont].next_maintenance_date = (temp.body.results[j].next_maintenance_date != undefined) ? temp.body.results[j].next_maintenance_date: "";
  		report.body.results[cont].type_extinguisher = (temp.body.results[j].type_extinguisher != undefined) ? temp.body.results[j].type_extinguisher: "";
       	report.body.results[cont].ubication = (temp.body.results[j].ubication != undefined) ? temp.body.results[j].ubication: "";
      	report.body.results[cont].active = temp.body.results[j].active;
      	report.body.results[cont].keycode = temp.body.results[j].keycode;
        report.body.results[cont].change_time = temp.body.results[j].change_time;
      	report.body.results[cont].id = temp.body.results[j].id;
		cont++;
    }
}

//final result preparation for the return
input = new Message();
input.body = {};
input.body.start = start;
input.body.limit = limit;
temp = CloudServiceAccessor.process("servicecreator.service.FLM_Checklist.flmc_extinguisher_getList",input);

report.body.start = temp.body.start;
report.body.total = temp.body.total;

return report;