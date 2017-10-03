/**
* RunScript: JavaScript runscript is used to run script.
* You should return message object
* The input arguments of the script is message. 
*/
var checklist_id=message.body.checklist_id;
var site=message.body.site;
var status=message.body.status;
var fme=message.body.fme;
var start_date=message.body.start_date;
var end_date=message.body.end_date;
var start="0";
var limit="500";

var input =new Message();
var input2 =new Message();
var input3 =new Message();

input.body={};
input.body.start=start;
input.body.limit=limit;
input.body.id_fuel_report=site;
input.body.start_date=start_date;
input.body.end_date=end_date;
var fuel = CloudServiceAccessor.process("servicecreator.service.FLM_checklist.flmc_fueling_report_getList",input); 
var ans= new Message();
ans.body={};
ans.body.results=[];
var nuevo= new Message();
nuevo.body={};
nuevo.body.results=[];
var cont=0;

for (var i=0;i<fuel.body.results.length;i++){
  	ans.body.results[cont]={};
	input.body={};
	input.body.site=fuel.body.results[i].site_fuel_report;
	var base = CloudServiceAccessor.process("servicecreator.service.cmdf_flm.cmdb_flm_generator_get",input);
  	input2.body={};
	input2.body.start=start;
	input2.body.limit=limit;
	input2.body.site_fuel_report=fuel.body.results[i].site_fuel_report;
	var site_fuel = CloudServiceAccessor.process("servicecreator.service.mm_report.prev_site_getlist",input2); 
  	for (var j=0;j<site_fuel.body.results.length;j++){
    	nuevo.body.results[j]={}
    	nuevo.body.results[j].checklist_id=site_fuel.body.results[j].id_fuel_report;
    	nuevo.body.results[j].site_entrance_date=site_fuel.body.results[j].site_entrance_date;
    	nuevo.body.results[j].site_fuel_report=site_fuel.body.results[j].site_fuel_report;
      	if(nuevo.body.results[j].checklist_id==fuel.body.results[i].id_fuel_report && j!=0)
      	{
        	input3.body={};
			input3.body.id_fuel_report=site_fuel.body.results[j-1].id_fuel_report;
			var fuel_new = CloudServiceAccessor.process("servicecreator.service.FLM_checklist.flmc_fueling_report_get",input3); 
			ans.body.results[cont].tank_inicial_level_prev=(fuel_new.body.result.tank_inicial_level != undefined) ? fuel_new.body.result.tank_inicial_level:"" ;
    		ans.body.results[cont].fuel_galons_provided_prev=(fuel_new.body.result.fuel_galons_provided != undefined) ? fuel_new.body.result.fuel_galons_provided:"";
    		ans.body.results[cont].tank_final_level_prev=(fuel_new.body.result.tank_final_level != undefined) ? fuel_new.body.result.tank_final_level:"";
        	break;
      	}
       	else{
        	ans.body.results[cont].tank_inicial_level_prev="Sin Datos" ;
    		ans.body.results[cont].fuel_galons_provided_prev="Sin Datos";
    		ans.body.results[cont].tank_final_level_prev="Sin Datos";
        }
    
    }

 	ans.body.results[cont].checklist_id=(fuel.body.results[i].id_fuel_report!= undefined) ? fuel.body.results[i].id_fuel_report: "" ;
	ans.body.results[cont].site=(fuel.body.results[i].site_fuel_report!= undefined) ? fuel.body.results[i].site_fuel_report: "" ;
  	ans.body.results[cont].region=(fuel.body.results[i].region != undefined) ? fuel.body.results[i].region: ""  ;
	ans.body.results[cont].task_status_cl= (fuel.body.results[i].task_status_cl != undefined) ? fuel.body.results[i].task_status_cl: "";
  	ans.body.results[cont].tank_capacity=(fuel.body.results[i].tank_capacity != undefined) ? fuel.body.results[i].tank_capacity: "" ;
  	ans.body.results[cont].tank_inicial_level=(fuel.body.results[i].tank_inicial_level != undefined) ? fuel.body.results[i].tank_inicial_level:"" ;
    ans.body.results[cont].fuel_galons_provided=(fuel.body.results[i].fuel_galons_provided != undefined) ? fuel.body.results[i].fuel_galons_provided:"";
    ans.body.results[cont].tank_final_level=(fuel.body.results[i].tank_final_level != undefined) ? fuel.body.results[i].tank_final_level:"";
    ans.body.results[cont].fuel_gen_prev_horometer=(fuel.body.results[i].fuel_gen_prev_horometer!= undefined) ? fuel.body.results[i].fuel_gen_prev_horometer:"";
  	ans.body.results[cont].fuel_gen_horometer=(fuel.body.results[i].fuel_gen_horometer!= undefined) ? fuel.body.results[i].fuel_gen_horometer:"";
    var aux= parseFloat(ans.body.results[cont].fuel_gen_horometer) - parseFloat(ans.body.results[cont].fuel_gen_prev_horometer);
  	if (isNaN(aux)!=true)
    	ans.body.results[cont].operation_time=(aux).toFixed(2);
  	else
    	ans.body.results[cont].operation_time="";
  	
    ans.body.results[cont].fuel_gen_horo_status=(fuel.body.results[i].fuel_gen_horo_status!= undefined) ? fuel.body.results[i].fuel_gen_horo_status:"";
  	ans.body.results[cont].site_entrance_date=(fuel.body.results[i].site_entrance_date!= undefined) ? fuel.body.results[i].site_entrance_date:"";
    ans.body.results[cont].site_leave_date=(fuel.body.results[i].site_leave_date!= undefined) ? fuel.body.results[i].site_leave_date:"";
  	var x = parseFloat(ans.body.results[cont].tank_final_level) - parseFloat(ans.body.results[cont].tank_inicial_level) ;
	var y = parseFloat(ans.body.results[cont].fuel_gen_horometer) - parseFloat(ans.body.results[cont].fuel_gen_prev_horometer);
	var ave_cons= x/y;
	try{
      ans.body.results[cont].baseline=(base.body.result.baseline!= undefined) ? base.body.result.baseline:"" ;
      if (isNaN(ave_cons)!=true && isFinite(ave_cons)!=false)
        ans.body.results[cont].ave_cons=(ave_cons).toFixed(2);
      else { ans.body.results[cont].ave_cons=""; }
      var aux2=parseFloat(ans.body.results[cont].ave_cons)-parseFloat(ans.body.results[cont].baseline);
      ans.body.results[cont].deviation=(aux2).toFixed(2);
      var aux3 = 0.1;
      var aux4= parseFloat(ans.body.results[cont].baseline)*aux3;
      var aux5= -(parseFloat(ans.body.results[cont].baseline)*aux3);
      if(aux2<=aux4 && aux2>=aux5)
      {
      	ans.body.results[cont].problem="OK";
      }
      else if (isNaN(ans.body.results[cont].deviation)==true){
        ans.body.results[cont].problem="";
        ans.body.results[cont].deviation=""
      }
      else
      {
        ans.body.results[cont].problem="NO OK";
      }
    }
  	catch(err){
      ans.body.results[cont].baseline="";
      ans.body.results[cont].ave_cons="";
      ans.body.results[cont].deviation="";
    }
  	
    
  	
    ans.body.results[cont].fueling_requester=(fuel.body.results[i].fueling_requester!= undefined) ? fuel.body.results[i].fueling_requester:"";
  	ans.body.results[cont].fuel_obs=(fuel.body.results[i].fuel_obs!= undefined) ? fuel.body.results[i].fuel_obs:"";
  	ans.body.results[cont].fme=(fuel.body.results[i].fme!= undefined) ? fuel.body.results[i].fme:"";
  
  cont++;
}
var numt= ans.body.results.length;
ans.body.start = '0';
ans.body.total = numt.toString();
return ans;