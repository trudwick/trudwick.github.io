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
    // inp.classList.add("text-secondary");
    if(i< defVals.length )
      inp.placeholder = defVals[i]

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
    // console.log($box.val())
    $("#out").html(dispStrs[$box.val()])
  });
}

// When the button is clicked, make sure everything is populated, then call solve, buildDisp, and show the output
function clicked(){
  nums=[]
  let fail = false;
  $(".numinp").each(function() {
    // console.log(this.value)
    if (isNaN(this.value))
      fail=true;
    else
      nums.push(parseInt(this.value));
  });
  // console.log(nums)

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
    fullSolutions[z]={}
  }
  // console.log(goal)
  var ordering=[-1,-1,-1,-1,-1,-1]
  for(let n0=0; n0<6; n0++){
    ordering[0]=n0
    for(let n1=0; n1<6; n1++){
      ordering[1]=n1
      for(let n2=0; n2<6; n2++){
        ordering[2]=n2
        for(let n3=0; n3<6; n3++){
          ordering[3]=n3
          for(let n4=0; n4<6; n4++){
            ordering[4]=n4
            for(let n5=0; n5<6; n5++){
              ordering[5]=n5
              let good=true
              for(let n_check_1 = 0; n_check_1<6; n_check_1++)
                for(let n_check_2 = n_check_1+1; n_check_2<6; n_check_2++)
                  if(ordering[n_check_1]==ordering[n_check_2])
                    good = false
              if (good)
                find(nums, ordering, goal)
            }
          }
        }
      }
    }
  }
}

//Recursively run each operation.
function find(nums, ordering, goal){
  let results=[0,0,0,0,0,0]
  let strs=["","","","","",""]
  results[0]=nums[ordering[0]]
  strs[0]=""+nums[ordering[0]]
  for(let op1=0; op1<4; op1++){
    let outp=operate(results[0],nums[ordering[1]],op1, goal, 1+1, strs[0])
    // console.log(outp)
    results[1]=outp[0]
    strs[1] = outp[1]
    for(let op2=0; op2<4; op2++){
      let outp=operate(results[1],nums[ordering[2]],op2, goal, 2+1, strs[1])
      results[2]=outp[0]
      strs[2] = outp[1]

      for(let op3=0; op3<4; op3++){
        let outp=operate(results[2],nums[ordering[3]],op3, goal, 3+1, strs[2])
        results[3]=outp[0]
        strs[3] = outp[1]

        for(let op4=0; op4<4; op4++){
          let outp=operate(results[3],nums[ordering[4]],op4, goal, 4+1, strs[3])
          results[4]=outp[0]
          strs[4] = outp[1]

          for(let op5=0; op5<4; op5++){
            let outp=operate(results[4],nums[ordering[5]],op5, goal, 5+1, strs[4])
            results[5]=outp[0]
            strs[5] = outp[1]


            //account for using other 2 separately
            outp = operate(nums[ordering[4]], nums[ordering[5]], op4, goal, 2, ""+nums[ordering[4]])
            let tmpResults = outp[0]
            let tmpStr = outp[1]

            operate(results[3], tmpResults,op5, goal, 6, strs[3], "("+tmpStr+")")
          }
        }
      }
    }
  }
}

//count number of nulls

function operate(num1,num2,operator, goal, numbersUsed, prevStr, prevStr2 = ""){
  // console.log(prevStr)
  let str=""
  let newRes = 0
  if(prevStr2===""){
    prevStr2=""+num2
  }
  if(operator==0){
    str = prevStr+"+"+prevStr2
    newRes = num1+num2
  }
  else if(operator==1){
    str = prevStr+"-"+prevStr2
    newRes = num1-num2
  }
  else if(operator==2){
    str = prevStr+"*"+prevStr2
    newRes = num1*num2
  }
  else {
    str = prevStr+"/"+prevStr2
    newRes = num1/num2
  }
  if(goal == newRes){
    // console.log(prevStr2+prevStr2)
    fullSolutions[numbersUsed][str]=true
  }
  // console.log(newRes,str)
  return [newRes, str]
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
  dispStrs[4] = "Note: All operations are left to right, ignoring OOP. That is, assume all OOP are the same priority<br>"
  dispStrs[5] = "Note: All operations are left to right, ignoring OOP. That is, assume all OOP are the same priority<br>"
  for (let k in fullSolutions) {
    // console.log('Hi',k,fullSolutions[k],Object.keys(fullSolutions[k]).length)
    ct+=Object.keys(fullSolutions[k]).length;
    if(k==6){
      dispStrs[2]+=Object.keys(fullSolutions[k]).length;
      dispStrs[0]=Object.keys(fullSolutions[k]).length>0?"YES!":"Nah Dawg";
    }
    dispStrs[3] += "Using "+k+" Numbers:"+Object.keys(fullSolutions[k]).length+"<br>";
    for (sol in fullSolutions[k]){
      // console.log(sol);
      let soln = sol
      dispStrs[5] += soln + "<br>"
      dispStrs[4] += soln.replaceAll(/[0-9]+/g,'?') + "<br>"
    }
    
  }

  dispStrs[1]="Total Solutions:"+ct;
  // console.log(ct)

  
}