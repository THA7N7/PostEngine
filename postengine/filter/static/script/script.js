
$(document).ready(function(){

    // format dataTable 
    $('#dataTable tfoot th').each(function(){
      var title =$(this).text();
      $(this).html( '<input type="text" class="form-control form-control-sm" placeholder="'+title+'"/>');
	    });
	    var table = $('#dataTable').DataTable({
	    	"language": {"decimal":"",
			    "emptyTable":"В таблице отсутствуют данные",
			    "info":"Записи с _START_ по _END_ ", //"Записи с _START_ по _END_ из _TOTAL_ "
			    "infoEmpty":"Записи отсутствуют",
			    "infoFiltered":"(отфильтровано из _MAX_ записей)",
			    "infoPostFix":"",
			    "thousands":" ",
			    "lengthMenu":"Показано _MENU_ записей",
			    "loadingRecords":"Загрузка записей...",
			    "processing":"Подождите...",
			    "search":"Поиск:",
			    "zeroRecords":"Ноль записей",
			    "paginate": {
			        "first":"Первая",
			        "last":"Последняя",
			        "next":"Следующая",
			        "previous":"Предыдущая"
			    }
			},
	      "scrollY":        "360px",
	      "scrollCollapse": true,
	      "paging":         false
	    });
	    table.columns().every(function(){
	      var that = this;
	      $('input', this.footer()).on ('keyup change', function(){
	        if (that.search()!== this.value){
	          that.search(this.value).draw();
	        }
    	});
    });

	// adds a row to the small table dataFilter when we click the dataTable row
	$("#dataTableBody").on('click', "tr", function(){
		var inx = $(this).find("td").eq(0).html();
		var scr	= $(this).find("td").eq(5).html();
    	if (notexistrow(inx, "#dataFilterTable")){
			insertrow(inx, scr, "#dataFilterTable");
    	}
        calcrows();
    });
	
	// removes the rows from tables dataFilter if then checked
	$("#deleteRow").click(function(){
        $("table > tbody").find('input[name="record"]').each(function(){
            if($(this).is(":checked")){
                $(this).parents("tr").remove();
            }
        });
        calcrows();
        periodAdvCam();
    });

	// removes all rows from the small table dataFilter
	$("#clearRows").click(function(){
		$("#dataFilterTable > tbody").empty();
        calcrows();
	});

	// insert all rows to the small table dataFilter
	$("#addRows").click(function(){
		$("#dataTableBody > tr").each(function(){			
	        var inx = $(this).find("td").eq(0).html();
	        var scr	= $(this).find("td").eq(5).html();
	    	if (notexistrow(inx, "#dataFilterTable")){
				insertrow(inx, scr, "#dataFilterTable");
	    	}
	        calcrows();
		});	
	});

    //count rows and calc 
    function calcrows(){
        var rowCount = $('table #dataFilterBody tr:last').index() + 1;
        var sumScrQnt = sumscr();
        $('#countOPS').text('Всего: ОПС - '+rowCount+', экранов - '+sumScrQnt);
    }

    // calc sum screen
	function sumscr(){
	    var sum = 0;
	    $('#dataFilterBody tr').each(function(){
            var value = parseInt($('td',this).eq(2).text());
            sum += value;
        });
	    return sum;
	}

    //Check isexist "v"alue in "t"able
    function notexistrow(v, t){
        var inxcontains = $(''+t+' tr > td:contains('+v+')').length;
        if (inxcontains == 0){
        	return true;
        }else{
        	return false;
        }       
	}    

    //insert row into "t"able
    function insertrow(a, b, t){
		$(''+t+'').append(`<tr>
			<td class='text-center'><input type='checkbox' name='record'></td>
			<td class='text-center'>`+a+`</td>
			<td class='text-center'>`+b+`</td>
			</tr>`);
    }

 	// input flight
    $("#addFlight").click(function() {
        var fd = new Date($("#fDate").val());
        var ld = new Date($("#lDate").val());
        if (fd != "" && ld != "" && ld >= fd){
			var months = monthsQnty(fd,ld);
        	if (months > 1) {
				for (let i = 1; i <= months; i+=1){
					if(i == 1){
						// alert('первый период');						
						var d = new Date(fd);
						d.setMonth(fd.getMonth() + 1);
						d.setDate(1);
						d.setHours(-1);
						var d2 = d;
                        var arrchk = checkPeriod(fd,d2);
						addFlight (arrchk[0],d2);
					}else if (i == months){						
						// alert('последний период');
						var d = new Date(ld);
						d.setDate(1);
						var d1 = d;
                        var arrchk = checkPeriod(d1,ld);
                        addFlight (d1,arrchk[1]);
					}else{
						// alert(i+'-й период');
						var d = new Date(d2);
						d.setDate(d2.getDate() + 1);
						var d1 = new Date(d);
						d.setMonth(d1.getMonth() + 1);
						d.setDate(1);
						d.setHours(-1);
						var d2 = d;
						addFlight (d1,d2);
					}
				}
        	}else{
                var arrchk = checkPeriod(fd,ld);
                addFlight (arrchk[0],arrchk[1]);
                
        	}
	    }else{
            alert("Период некорректный!"); 
        }
	});

    // adds the flights
    function addFlight (date1,date2) {
        var str_fdate = parseDate(date1);
        var str_ldate = parseDate(date2);	        
    	var days = daysDiff(date1, date2);
		var str_period = str_fdate+' - '+str_ldate;
        if (notexistrow(str_period,"#flightTable")){            
            insertrow(str_period, days, "#flightTable");
            periodAdvCam();                
        }   	
	}

    // calc difference Days between dates
    function daysDiff(date1, date2) {
        var _MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
        var utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
        var utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
        return Math.round((utc2 - utc1) / _MILLISECONDS_PER_DAY) + 1;
    }

	// calc quantity Month
    function monthsQnty(date1, date2) {
	    var months;
	    months = (date2.getFullYear() - date1.getFullYear()) * 12;
	    months -= date1.getMonth();
	    months += date2.getMonth() + 1;
	    return months <= 1 ? 1 : months;
	}

    // date format dd.mm.yyyy
    function parseDate(dateObject) {
        var d = new Date(dateObject);
        var day = d.getDate();
        var month = d.getMonth() + 1;
        var year = d.getFullYear();
        if (day < 10) {
            day = "0" + day;
        }
        if (month < 10) {
            month = "0" + month;
        }
        var date = day + "." + month + "." + year;
        return date;
    }

    // from dd.mm.yyyy to yyyy.mm.dd
    function dmy2ymd(dmy){
        arr = dmy.split('.');
        ymd = arr[2]+'-'+arr[1]+'-'+arr[0];
        return ymd;
    }

    // start & finish Advertising Campaign
    function periodAdvCam() {
        var strdays = "";
        var arrdays = [];
        var arrdates = [];
        $('#flightTable tbody tr').each(function() {            
            var value = $('td',this).eq(1).text();
            if (strdays == "") {
                strdays = value;
            }else{
                strdays = strdays+' - '+value;
            }            
        });
        arrdays = strdays.split(' - ');
        arrdates= $.map(arrdays,function(d) {
            return new Date(dmy2ymd(d));
        });
        var startday = new Date(Math.min.apply(null,arrdates));
        var finishday = new Date(Math.max.apply(null,arrdates));
        $('#dtStartDay').val(""+parseDate(startday)+"");
        $('#dtFinishDay').val(""+parseDate(finishday)+"");      
    }

	// month button click
	$(".month").click(function(){
		addmonth($(this).attr('data-value'));
	});

	// add selection month to FlightTable
	function addmonth(m) {
		var d = new Date();
		if  (d.getMonth() + 1 == m) {
			var fd = new Date(d.setDate(d.getDate() + 2)); // plus 2 days
			var ld = new Date();
			var ld = new Date(ld.setMonth(m));
			var ld = new Date(ld.setDate(1));
			var ld = new Date(ld.setHours(-1));
		}else if (d.getMonth() + 1 > m) {
			var fd = new Date();
			var fd = new Date(fd.setYear(fd.getFullYear() + 1)); // next year
			var fd = new Date(fd.setMonth(m - 1)); 
			var fd = new Date(fd.setDate(1));
			var ld = new Date(); // current date
			var ld = new Date(ld.setYear(ld.getFullYear() + 1)); // next year
			var ld = new Date(ld.setMonth(m)); // slide month + 1
			var ld = new Date(ld.setDate(1)); // going to 1st of the month
			var ld = new Date(ld.setHours(-1)); // going to last hour before this date even started.
		}else{
			var fd = new Date(); 
			var fd = new Date(fd.setMonth(m - 1)); 
			var fd = new Date(fd.setDate(1)); 
			var ld = new Date();
			var ld = new Date(ld.setMonth(m));
			var ld = new Date(ld.setDate(1));
			var ld = new Date(ld.setHours(-1));
		}
		addFlight (fd,ld);
	}

	// lastday date
	function lastday(date){
		var m = date.getMonth();
		var date = new Date(date.setMonth(m + 1));
		var date = new Date(date.setDate(1));
		var date = new Date(date.setHours(-1));
		return date;
	}

    // merge, add, skip new  perion to flightTable
    function checkPeriod(dn1,dn2) {
        var arrtd = [];
        var arrtr = [];
        var i  = 0
        $('#flightTable tbody tr').each(function() {            
            var value = $('td',this).eq(1).text();
            arrtd = value.split(' - ');
            arrtd = $.map(arrtd,function(d) {
            return new Date(dmy2ymd(d));});
            arrtr.push(arrtd);            
            if (dn1.getMonth() == arrtr[i][0].getMonth()) {
				var arrxx = comparePeriod(arrtr[i][0],arrtr[i][1],dn1,dn2);
				if (arrxx[0] == 'new' && arrxx[1] == 'new') {
				}else{
                    $('td',this).parents("tr").remove();
					dn1 = arrxx[0];
					dn2 = arrxx[1];
				}
            }
            i+=1
        });
        return [dn1,dn2];    
    }

    // compare period (dt - exist ? dn - new)
    function comparePeriod(dt1,dt2,dn1,dn2){
    	// 'new' - add period without delete anything row
		if (dn1 > dt2) {
            return ['new','new'];
        }else if (dn2 < dt1) {
            return ['new','new'];
        }else if (dn1 <= dt2 && dn1 >= dt1) {
            if (dn2 >= dt2) {
                return [dt1,dn2];
            }else if (dn2 <= dt2) { 
                return [dt1,dt2];
            }
        }else if (dn2 >= dt1 && dn2 <= dt2) {
            if (dn1 <= dt1) {
                return [dn1,dt2];
            }else if (dn1 >= dt1) {
                return [dt1,dt2];
            }
        }else if (dn2 >= dt2 && dn1 <= dt1) {
            return [dn1,dn2];
        }else{
            alert ('Это сообщение не должно было появиться. Неверный алгоритм.');
        }
    }
    // sort btn
    $(".btn-sort").click(function(){
        sortTable($('#dataFilterTable'),'asc',1)
    });

    // sort table
    function sortTable(table,order,x){
        var rows = table.find('tr').toArray().sort(comparer(Number(x)))
        this.asc = order
        if (!this.asc) {
            rows = rows.reverse()
        }
        for (var i = 0; i <= rows.length; i++){
            console.log(rows[i])
            table.append(rows[i])
        }
    }
    function comparer(index) {
        return function(a, b) {
            var valA = getCellValue(a, index); 
            var valB = getCellValue(b, index);
            return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.toString().localeCompare(valB)
        }
    }
    function getCellValue(row, index){
        return $(row).children('td').eq(index).text()
    }





    // test button click
    $(".test-btn").click(function(){
		// alert('тест не задан...');
        // sortTable($('#dataFilterTable'),'asc',1)

    });


});