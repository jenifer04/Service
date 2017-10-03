/**
* RunScript: JavaScript runscript is used to run script.
* You should return message object
* The input arguments of the script is message. 
*/
var checklist_id=message.body.checklist_id;
var site=message.body.site;
var start_date=message.body.maintenance_date_start;
var end_date=message.body.maintenance_date_end;
var status=message.body.status;
var start="0";
var limit="500";

var input =new Message();

input.body={};
input.body.start=start;
input.body.limit=limit;
input.body.id_pm_infra=site;
input.body.task_status_cl=status;
input.body.start_time_infra=start_date;
input.body.end_time_infra=end_date;
var infra = CloudServiceAccessor.process("servicecreator.service.FLM_checklist.flmc_pm_infra_model_getList",input); 

input =new Message();
input.body={};
input.body.start=start;
input.body.limit=limit;
input.body.task_id=site;
input.body.task_status_cl=status;
input.body.start_timePLM=start_date;
input.body.end_timePLM=end_date;
var prog = CloudServiceAccessor.process("servicecreator.service.FLM_checklist.flmc_programmed_model_getList",input); 

input =new Message();
input.body={};
input.body.start=start;
input.body.limit=limit;
input.body.id_cm=site;
input.body.task_status_cl=status;
input.body.start_time=start_date;
input.body.end_time=end_date;
var eme = CloudServiceAccessor.process("servicecreator.service.FLM_checklist.flmc_cm_model_getList",input); 

input =new Message();
input.body={};
input.body.start=start;
input.body.limit=limit;
input.body.id_pm_tx=site;
input.body.task_status_cl=status;
input.body.start_timeTX=start_date;
input.body.end_timeTX=end_date;
var tx = CloudServiceAccessor.process("servicecreator.service.FLM_checklist.flmc_pm_tx_model_getList",input); 

input =new Message();
input.body={};
input.body.start=start;
input.body.limit=limit;
input.body.id_pm_access=site;
input.body.task_status_cl=status;
input.body.start_time_acc=start_date;
input.body.end_time_acc=end_date;
var tdf = CloudServiceAccessor.process("servicecreator.service.FLM_checklist.flmc_pm_access_model_getList",input);

input =new Message();
input.body={};
input.body.start=start;
input.body.limit=limit;
input.body.id_pm_handson=site;
input.body.task_status_cl=status;
input.body.start_timeHD=start_date;
input.body.end_timeHD=end_date;
var hm = CloudServiceAccessor.process("servicecreator.service.FLM_checklist.flmc_pm_hands_on_model_getList",input); 

var ans= new Message();
ans.body={};
ans.body.results=[];
var cont=0;
for (var i=0;i<infra.body.results.length;i++){
	ans.body.results[cont]={};
 	ans.body.results[cont].checklist_id=infra.body.results[i].id_pm_infra;
	ans.body.results[cont].site=infra.body.results[i].site_infra;
	ans.body.results[cont].status=infra.body.results[i].task_status_cl;
	ans.body.results[cont].fecha_enviado=infra.body.results[i].last_update_time_infra;
  	ans.body.results[cont].fecha_complete=infra.body.results[i].site_exit_infra;
  	ans.body.results[cont].draft_time=infra.body.results[i].draft_time_infra;
  	ans.body.results[cont].maintenance_type="MANTENIMIENTO DE INFRAESTRUCTURA";
  cont++;
}
for (var i=0;i<prog.body.results.length;i++){
	ans.body.results[cont]={};
 	ans.body.results[cont].checklist_id=prog.body.results[i].id_plm;
	ans.body.results[cont].site=prog.body.results[i].site_plm;
	ans.body.results[cont].status=prog.body.results[i].task_status_cl;
	ans.body.results[cont].fecha_enviado=prog.body.results[i].last_update_time_plm;
    ans.body.results[cont].fecha_complete=prog.body.results[i].complete_time_plm;
  	ans.body.results[cont].draft_time=prog.body.results[i].draft_time_plm;
  	ans.body.results[cont].maintenance_type="MANTENIMIENTO PROGRAMADO";
    cont++;
}
for (var i=0;i<eme.body.results.length;i++){
	ans.body.results[cont]={};
 	ans.body.results[cont].checklist_id=eme.body.results[i].id_cm;
	ans.body.results[cont].site=eme.body.results[i].site_cm;
	ans.body.results[cont].status=eme.body.results[i].task_status_cl;
	ans.body.results[cont].fecha_enviado=eme.body.results[i].last_update_time;
	ans.body.results[cont].fecha_complete=eme.body.results[i].complete_time_cm;
  	ans.body.results[cont].draft_time=eme.body.results[i].draft_time_cm;
  	ans.body.results[cont].maintenance_type="MANTENIMIENTO EMEREGENTE";
  cont++;
}
for (var i=0;i<tx.body.results.length;i++){
	ans.body.results[cont]={};
 	ans.body.results[cont].checklist_id=tx.body.results[i].id_pm_tx;
	ans.body.results[cont].site=tx.body.results[i].site_tx;
    ans.body.results[cont].status=tx.body.results[i].task_status_cl;
	ans.body.results[cont].fecha_enviado=tx.body.results[i].last_update_time;
	ans.body.results[cont].fecha_complete=tx.body.results[i].site_exit_tx;
    ans.body.results[cont].draft_time=tx.body.results[i].draft_time_tx;
 	ans.body.results[cont].maintenance_type="MANTENIMIENTO DE TRANSMISIONES";
  cont++;
}
for (var i=0;i<tdf.body.results.length;i++){
	ans.body.results[cont]={};
 	ans.body.results[cont].checklist_id=tdf.body.results[i].id_pm_access;
	ans.body.results[cont].site=tdf.body.results[i].site_acc;
    ans.body.results[cont].status=tdf.body.results[i].task_status_cl;
  	ans.body.results[cont].fecha_enviado=tdf.body.results[i].last_update_time_acc;
	ans.body.results[cont].fecha_complete=tdf.body.results[i].arrive_time_acc;
  	ans.body.results[cont].draft_time=tdf.body.results[i].draft_time_acc;
  	ans.body.results[cont].maintenance_type="RED DE ACCESO";
  cont++;
}
for (var i=0;i<hm.body.results.length;i++){
	ans.body.results[cont]={};
 	ans.body.results[cont].checklist_id=hm.body.results[i].id_pm_handson;
	ans.body.results[cont].site=hm.body.results[i].site_hm;
	ans.body.results[cont].status=hm.body.results[i].task_status_cl;
	ans.body.results[cont].fecha_enviado=hm.body.results[i].last_update_time_hm;
  	ans.body.results[cont].fecha_complete=hm.body.results[i].complete_time_hm;
    ans.body.results[cont].draft_time=hm.body.results[i].draft_time_hm;
  	ans.body.results[cont].maintenance_type="OJOS Y MANOS";
  cont++;
}

var des = 0;
var waste = new Message();

waste.body = {}
waste.body.results = [];
var cw = 0;
var input2;

for (var i=0;i<ans.body.results.length;i++){
  	input =new Message();
 	input.body={};
  	input.body.checklist_id = ans.body.results[i].checklist_id;
  	input.body.start = start;
  	input.body.limit = "100";
  
    des = CloudServiceAccessor.process("servicecreator.service.FLM_checklist.flmc_waste_getList",input);
  
  	input2 =new Message();
 	input2.body={};
	input2.body.task_id = ans.body.results[i].checklist_id;
	com = CloudServiceAccessor.process("servicecreator.service.task.task_work_get",input2);
  
  	for(var j = 0; j<des.body.results.length; j++){
    	waste.body.results[cw] = {};
		waste.body.results[cw].checklist_id = des.body.results[j].checklist_id;
       	waste.body.results[cw].site = ans.body.results[i].site;
		waste.body.results[cw].id_waste = des.body.results[j].id_waste;
      	waste.body.results[cw].quantity = des.body.results[j].quantity;
      	waste.body.results[cw].unit = des.body.results[j].unit;
        waste.body.results[cw].type = des.body.results[j].type;
      	waste.body.results[cw].report_status = ans.body.results[i].status;
      	waste.body.results[cw].report_date = ans.body.results[i].fecha_enviado;
      	waste.body.results[cw].maintenance_date = ans.body.results[i].fecha_complete;
      	waste.body.results[cw].draft_time = ans.body.results[i].draft_time;
      	waste.body.results[cw].fme = com.body.result.accept_operator;
      	waste.body.results[cw].maintenance_type = ans.body.results[i].maintenance_type;
      	if (waste.body.results[cw].fme == "Kathy_Salgado" || waste.body.results[cw].fme == "Cristian_Espinosa")
      		waste.body.results[cw].partner = "Rhelec Ingenieria";
      	else
        	waste.body.results[cw].partner = com.body.result.cooperator;
      

      	 cw++;
    }
 
}

var numt= waste.body.results.length;
waste.body.start = '0';
waste.body.total = numt.toString();
return waste;