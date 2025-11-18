const count = 30;
let allQuestions = questionData;
let sessionQuestions = [];
let index = 0;
let correctAnswers = 0;

console.log("Kérdések betöltve:", allQuestions.length, "db");

function mix(tomb){
    for (let i = tomb.length-1;i>0;i--){
        const j = Math.floor(Math.random()*(i+1));
        [tomb[i],tomb[j]]= [tomb[j],tomb[i]];
    }
    return tomb;
}

function startQuiz(){
    mix(allQuestions);
    sessionQuestions = allQuestions.slice(0,count);
    for (let i = 0; i<sessionQuestions.length;i++){
        mix(sessionQuestions[i].valasz);
    }
    index = 0;

    document.getElementById('start-container').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';

    showQuestion();

    
}

function showQuestion(){
    const currentQuestion = sessionQuestions[index];

    document.getElementById('evaluate').style.display = 'block';
    document.getElementById('nextQuestion').style.display = 'none';

    document.getElementById('txtQuestions').textContent = currentQuestion.kerdes;
    document.getElementById('imgQuestions').innerHTML = '';
    

    if (currentQuestion.kep_url){
        document.getElementById('imgQuestions').style.display = 'flex';
        picture = document.createElement('img');
        picture.src = currentQuestion.kep_url;
        picture.alt = "Ábra";
        picture.onclick = function(){
            document.getElementById('imgModalContainer').style.display = 'flex';
            document.getElementById('imgModal').src = this.src;
        }
        document.getElementById('imgQuestions').appendChild(picture); 
    } else {
        document.getElementById('imgQuestions').style.display = 'none';
    }

    const answer = document.getElementById('answers');
    answer.innerHTML = '';
    currentQuestion.valasz.forEach((possibleAnswer, i) =>
    {
        const box = document.createElement('div');
        box.className = 'aktAnswer';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'ans'+i;
        checkbox.value = i;

        const answerLabel = document.createElement('label');
        answerLabel.htmlFor = 'ans'+i;
        answerLabel.textContent = possibleAnswer.szoveg;
        answerLabel.style.cursor = 'pointer';        

        box.appendChild(checkbox);
        box.appendChild(answerLabel);

        box.onclick = function(e) {
            if (e.target !== checkbox && e.target !== answerLabel){
                checkbox.checked = !checkbox.checked;
            }
        };

        answer.appendChild(box);

    }); 
    document.getElementById('counter').textContent = index+1 + ' / ' + count;
    
}

function evaluation(){
    const aktuell = sessionQuestions[index];
    let right = true;
    

    aktuell.valasz.forEach((ans, i) =>
    {
        const checkbox = document.getElementById('ans'+i);
        checkbox.disabled = true;
        const box = checkbox.parentElement;
        if (checkbox.checked && !ans.helyes){
            box.style.background = '#ffcccc'
            right = false;
        } else if (checkbox.checked && ans.helyes){
            box.style.background = '#ccffcc'
        } else if (!checkbox.checked && ans.helyes){
            box.style.background = '#00a000'
            right = false;
        }
    });

    if (right) correctAnswers++;
    console.log(correctAnswers);
    index++;

    document.getElementById('evaluate').style.display = 'none';
    document.getElementById('nextQuestion').style.display = 'block';

}


function nextQuestion(){
    if (index < sessionQuestions.length) {
        showQuestion();
    } else {
        const percent = Math.round((correctAnswers / sessionQuestions.length) * 100);
        alert(`Vége a kvíznek!\nHelyes válaszok: ${correctAnswers} / ${sessionQuestions.length}\nEredmény: ${percent}%`);
    
        // Reset
        document.getElementById('quiz-container').style.display = 'none';
        document.getElementById('start-container').style.display = 'block';
        correctAnswers = 0;
        index = 0;
    }
}

document.getElementById('start-gomb').addEventListener('click',startQuiz);
document.getElementById('evaluate').addEventListener('click',evaluation);
document.getElementById('nextQuestion').addEventListener('click',nextQuestion);