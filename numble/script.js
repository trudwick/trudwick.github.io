$( document ).ready(function(){
  checkboxSetup();
  buildNums();
})
//variable for the actual solutions (recursively built)
var fullSolutions = {}
//variable for the strings to display (with different clicked checkboxes)
var dispStrs = {}

//build the initial numbers
function buildNums(){
  let defVals = [2,4,9,10,25,100]
  let goalInit = 228
  for(let i=0; i<6; i++){
    inp = document.createElement('input')
    inp.type='number'
    $('#nums').append(inp)
    inp.classList.add("numinp");
    inp.classList.add("text-secondary");
    if(i< defVals.length )
      inp.value = defVals[i]

  }
  $("#goal").val(goalInit)
}

//set up the checkboxes to run code when clicked.
function checkboxSetup(){
  $("input:checkbox").on('click', function() {
    // in the handler, 'this' refers to the box clicked on
    var $box = $(this);
    if ($box.is(":checked")) {
      // the name of the box is retrieved using the .attr() method
      // as it is assumed and expected to be immutable
      var group = "input:checkbox[name='" + $box.attr("name") + "']";
      // the checked state of the group/box on the other hand will change
      // and the current value is retrieved using .prop() method
      $(group).prop("checked", false);
      $box.prop("checked", true);
    } else {
      $box.prop("checked", false);
    }
    console.log($box.val())
    $("#out").html(dispStrs[$box.val()])
  });
}

// When the button is clicked, make sure everything is populated, then call solve, buildDisp, and show the output
function clicked(){
  nums=[]
  let fail = false;
  $(".numinp").each(function() {
    console.log(this.value)
    if (isNaN(this.value))
      fail=true;
    else
      nums.push(parseInt(this.value));
  });
  console.log(nums)

  goal=$("#goal").val()
  if (fail || isNaN(goal))
    return

  solve(nums,goal)
  buildDisp(fullSolutions)
  $( "#out" ).html(dispStrs[ $("input:checked").val() ]);
}
// wipe out fullSolutions, then call find on each number
function solve(nums,goal){
  fullSolutions = {}
  for(let z=0; z<=6; z++){
    fullSolutions[z]=[]
  }
  // console.log(goal)
  var true_table=[-1,-1,-1,-1,-1,-1]
  for(let z=0; z<6; z++){
    let prev = nums[z]
    true_table[z]=0
    find(nums,goal,prev.toString(),prev, true_table,1)
    true_table[z]=-1
  }
}

//Recursively run each operation.
function find(nums,goal,build_up, cur_ans, true_table, numberOrder){
  //if we found it, save it and quit
  // if (true_table[1]==0)
  //   console.log(nums,build_up,goal,cur_ans,true_table,numberOrder)
  let numNonNulls=numNums(true_table);
  if (goal==cur_ans){
    console.log("YAY",build_up)
    // const ct = (6-numNonNulls)
    fullSolutions[numNonNulls].push(build_up)
    // return;
  }

  for (let z=0; z<nums.length; z++){
    //make sure this number is there
    if(true_table[z]!=-1){
      continue;
    }
    //save current number (to repopulate later), then null it out.
    const cur_num = nums[z]
    true_table[z]=numberOrder;
    
    //same logic for each: build the string, calculate the answer, and recur
    let nextBuildStr = build_up+"+"+cur_num
    let nextAns = cur_ans+cur_num
    find( nums,goal,nextBuildStr,nextAns,true_table,numberOrder+1)

    nextBuildStr = build_up+"-"+cur_num
    nextAns = cur_ans-cur_num
    find( nums,goal,nextBuildStr,nextAns,true_table,numberOrder+1)

    let hasOper = build_up.includes("+") || build_up.includes("-");
    if (hasOper)
      nextBuildStr = "("+build_up+")*"+cur_num
    else
      nextBuildStr = build_up+"*"+cur_num
    nextAns = cur_ans*cur_num
    find( nums,goal,nextBuildStr,nextAns,true_table,numberOrder+1)


    if (hasOper)
      nextBuildStr = "("+build_up+")/"+cur_num
    else
      nextBuildStr = build_up+"/"+cur_num
    nextAns = cur_ans/cur_num
    find( nums,goal,nextBuildStr,nextAns,true_table,numberOrder+1)

    //put cur_num back in the array so we can use it in future recurrings
    true_table[z]=-1;
  }
}

//count number of nulls
function numNums(arr){
  let n = 0;
  for(let z=0; z<arr.length; z++){
    if(arr[z]!=-1){
      n++;
    }
  }
  return n;
}

/*
  build display string
  0 - Is it possible to get in perfect?
  1 - Total Solutions (All numbers)
  2 - Total Perfects
  3 - Solutions by Number Count
  4 - Show OOPs (No Numbers)
  5 - Full Solutions
*/
function buildDisp(){
  
  let ct = 0;
  dispStrs[2]=""
  dispStrs[3] = ""
  dispStrs[4] = ""
  dispStrs[5] = ""
  for (let k in fullSolutions) {
    console.log('Hi',k,fullSolutions[k])
    ct+=fullSolutions[k].length;
    if(k==6){
      dispStrs[2]+=fullSolutions[k].length;
      dispStrs[0]=fullSolutions[k].length>0?"YES!":"Nah Dawg";
    }
    dispStrs[3] += "Using "+k+" Numbers:"+fullSolutions[k].length+"<br>";
    for (sol in fullSolutions[k]){
      console.log(k,fullSolutions[k][sol]);
      let soln = fullSolutions[k][sol]
      dispStrs[5] += soln + "<br>"
      dispStrs[4] += soln.replaceAll(/[0-9]+/g,'?') + "<br>"
    }
    
  }
  dispStrs[1]="Total Solutions:"+ct;

  
}