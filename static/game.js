import { figuresArr } from "./tetromino.js"
import { startCampaignWindow, campaignStart, ending } from "./campaign.js"

let interval = 0
let rotate = 0
let isPaused = false
let startTime
let dropStart = Date.now()
let timerInterval
let nextFigure = 0
let gameOverChecker
let currentFigure = 0
let randomColor = 0
let figure = 0
let level = 1
let score = 0
let speed = 500
let reachedEnd = false

let inputScore = document.getElementsByTagName('input')[0]
let inputTimer = document.getElementsByTagName('input')[1]
inputTimer.value = `Timer: 00:00`

let startBtn = document.querySelector('.start-button')
startBtn.style.cursor = 'pointer'
let startOverlay = document.querySelector('.start-overlay')
let plotOverlay = document.querySelector('.plot-overlay')

export const audioElements = {
    story: document.getElementById('track'),
    level1: document.getElementById('track1'),
    level2: document.getElementById('track2'),
    level3: document.getElementById('track3')
}

export let currentAudioElement = audioElements.story

plotOverlay.hidden = true

function startWindow() {

    startBtn.addEventListener('click', function () {
        startOverlay.hidden = true
        startBtn.hidden = true
        startGame()
    })
}

export function startGameFromStory() {
    startGame()
}

function updateTimer() {
    if (!gameOverChecker) {
        const currentTime = Math.floor((Date.now() - startTime) / 1000)
        const minutes = Math.floor(currentTime / 60)
        const seconds = currentTime % 60
        const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        inputTimer.value = `Timer: ${formattedTime}`
    }
}

export function startGame() {
    mainTetrisTable()
    nextFigureTetrisTable()
    figuresCreator(5, 21, 0)
    drop()

    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000)

    window.addEventListener('keydown', function (e) {

        if (e.key === 'ArrowLeft') {
            figuresRightLeftMover(-1)
        } else if (e.key === 'ArrowRight') {
            figuresRightLeftMover(1)
        } else if (e.key === 'ArrowDown') {
            figuresDownMover()
        } else if (e.key === 'ArrowUp') {
            if (!isPaused) {
                rotate++
                figuresRotater()
            }
        } else if (e.key === 'Escape' && !controlBtn.disabled) {
            playAndPause()
        }
    })
}

function replayAudio() {
    currentAudioElement.currentTime = 0
    currentAudioElement.play()
}

for (const key in audioElements) {
    if (audioElements.hasOwnProperty(key)) {
        const audioElement = audioElements[key]
        audioElement.addEventListener('ended', replayAudio)
    }
}

function pauseGame() {
    clearInterval(interval)
    clearInterval(timerInterval)
    currentAudioElement.pause()
}

function resumeGame() {

    const currentTime = inputTimer.value.split(':')
    const minutes = parseInt(currentTime[1])
    const seconds = parseInt(currentTime[2])
    startTime = Date.now() - (minutes * 60 * 1000) - (seconds * 1000)
    timerInterval = setInterval(updateTimer, 1000)

    currentAudioElement.play()

    drop()
}

function playAndPause() {
    if (isPaused) {
        controlBtn.className = 'pause'
        isPaused = false
        resumeGame()
    } else {
        controlBtn.className = 'play'
        isPaused = true
        pauseGame()
    }
}

let controlBtn = document.getElementById('play-pause')
let restartBtn = document.getElementById('restart')
let restartOverlay = document.querySelector('.restart-overlay')
let backHome = document.getElementById('back-to-home')
let yesBtn = document.querySelector('.yes-btn')
let noBtn = document.querySelector('.no-btn')
let nextLevelOverlay = document.querySelector('.next-level-overlay')
let nextLevelBtn = document.querySelector('.next-level-btn')
let stopBtn = document.querySelector('.stop-btn')
let cowardOverlay = document.querySelector('.coward-overlay')
let cowardBtn = document.querySelector('.coward-btn')

function controlBar() {
    controlBtn.addEventListener('click', function () {
        playAndPause()
    })

    backHome.addEventListener('click', function () {
        location.reload()
    })

    restartBtn.addEventListener('click', function () {
        restartOverlay.classList.add('show-overlay')
        if (!isPaused) {
            playAndPause()
        }
        controlBtn.disabled = true
        restartBtn.disabled = true
        backHome.disabled = true
        controlBtn.style.cursor = 'default'
        restartBtn.style.cursor = 'default'
        backHome.style.cursor = 'default'
    })

    yesBtn.addEventListener('click', function () {
        restartOverlay.classList.remove('show-overlay')
        playAndPause()
        restartGame()
        timerInterval = setInterval(updateTimer, 1000)

        controlBtn.disabled = false
        restartBtn.disabled = false
        backHome.disabled = false
        controlBtn.style.cursor = 'pointer'
        restartBtn.style.cursor = 'pointer'
        backHome.style.cursor = 'pointer'
    })

    noBtn.addEventListener('click', function () {
        restartOverlay.classList.remove('show-overlay')
        playAndPause()

        controlBtn.disabled = false
        restartBtn.disabled = false
        backHome.disabled = false
        controlBtn.style.cursor = 'pointer'
        restartBtn.style.cursor = 'pointer'
        backHome.style.cursor = 'pointer'
    })
}

controlBar()

function restartGame() {
    for (let i = 0; i < figure.length; i++) {
        figure[i].classList.remove('figure', 'deadfigure')
        figure[i].style.removeProperty('background-color')
    }

    for (let rows = 1; rows < 21; rows++) {
        for (let columns = 1; columns < 11; columns++) {
            document.querySelector(`[posX="${columns}"][posY="${rows}"]`).classList.remove('deadfigure')
            document.querySelector(`[posX="${columns}"][posY="${rows}"]`).style.removeProperty('background-color')
        }
    }

    let dragonImg = document.querySelector('.dragon')
    let dragonContainer = document.querySelector('.dragoncontainer')
    let fire = document.querySelector('.firecontainer')
    let fire1 = document.querySelector('.firecontainer1')
    let fire2 = document.querySelector('.firecontainer2')

    if (campaignStart) {
        if (level === 1) {
            speed = 500
            dragonImg.src = './assets/icons/dragon1.1.png'
        } else if (level === 2) {
            speed = 300
            dragonImg.src = './assets/icons/dragon2.1.png'
            fire.src = ''
            fire1.src = ''
            fire2.src = ''
        } else if (level === 3) {
            speed = 200
            dragonContainer.style.marginLeft = '50rem'
            dragonImg.src = './assets/icons/dragon3.1.png'
            fire.src = ''
            fire1.src = ''
            fire2.src = ''
        }
    }

    clearInterval(interval)
    clearInterval(timerInterval)
    isPaused = false
    score = 0
    scoreOrganizer()
    inputTimer.value = `Timer: 00:00`
    startTime = Date.now()
    gameOverChecker = false

    figuresCreator(5, 21, 0)
    drop()
}

function nextLevel() {
    if (campaignStart) {
        if ((level === 1 && score === 60) || (level === 2 && score === 140) || (level === 3 && score === 220)) {
            let response = document.querySelector('.response')
            let cowardresponse = document.querySelector('.coward-container')

            if (level === 2) {
                response.textContent = 'You just cannot stop, can you? For your information, he had little dragon children and a wife. Shame on you...'
                nextLevelBtn.textContent = 'Move to the next murder'
                stopBtn.textContent = 'I am not a jerk :(('

                cowardresponse.textContent = 'Ha-ha, got you. Pathetic... Maybe you should go and complain to your mommy?'
                cowardBtn.textContent = 'Come back and proudly accept your killer soul'
            } else if (level === 3) {
                response.textContent = 'I have to admit, you have come a long way... for such an immoral and unscrupulous person. You can have princess back.'
                nextLevelBtn.textContent = 'Meet the princess'
                stopBtn.textContent = 'Do not click me'
                reachedEnd = true
            }

            nextLevelOverlay.classList.add('show-overlay')
            if (!isPaused) {
                playAndPause()
            }
            controlBtn.disabled = true
            restartBtn.disabled = true
            backHome.disabled = true
            controlBtn.style.cursor = 'default'
            restartBtn.style.cursor = 'default'
            backHome.style.cursor = 'default'


            nextLevelBtn.addEventListener('click', function () {
                nextLevelOverlay.classList.remove('show-overlay')

                playAndPause()

                if (level === 3 && reachedEnd === true) {
                    playAndPause()
                    const story = audioElements.story
                    story.play()
                    currentAudioElement = story
                    ending()
                } else if (level === 2) {
                    campaignLevel3()
                } else if (level === 1) {
                    campaignLevel2()
                }

                if (reachedEnd === false) {
                    controlBtn.disabled = false
                    restartBtn.disabled = false
                    backHome.disabled = false
                    controlBtn.style.cursor = 'pointer'
                    restartBtn.style.cursor = 'pointer'
                    backHome.style.cursor = 'pointer'
                }
            })
            stopBtn.addEventListener('click', function () {
                if (level === 3 && reachedEnd) {
                    nextLevelOverlay.classList.remove('show-overlay')

                    restartGame()
                    isPaused = true
                    playAndPause()

                    controlBtn.disabled = false
                    restartBtn.disabled = false
                    backHome.disabled = false
                    controlBtn.style.cursor = 'pointer'
                    restartBtn.style.cursor = 'pointer'
                    backHome.style.cursor = 'pointer'
                } else {
                    cowardOverlay.classList.add('show-overlay')
                }
            })
            cowardBtn.addEventListener('click', function () {
                cowardOverlay.classList.remove('show-overlay')
            })
        }
    }

}

let dragonContainer = document.querySelector('.dragoncontainer')

function campaignLevel1() {
    currentAudioElement.pause()
    currentAudioElement.currentTime = 0

    const level1Audio = audioElements.level1

    let controlsContainer = document.querySelector('.controlscontainer')
    let dragonImg = document.createElement('img')
    dragonImg.classList.add('dragon')
    if (campaignStart) {
        if (score === 0) {
            dragonImg.src = './assets/icons/dragon1.1.png'
        }
        controlsContainer.style.marginRight = '15rem'
    }

    level1Audio.play()
    currentAudioElement = level1Audio
    dragonContainer.append(dragonImg)
}

function campaignLevel2() {
    level = 2
    speed = 300
    restartGame()
    scoreOrganizer()
    currentAudioElement.pause()
    currentAudioElement.currentTime = 0

    const level2Audio = audioElements.level2

    // timerInterval = setInterval(updateTimer, 1000)
    if (timerInterval) {
        timerInterval = setInterval(updateTimer, 1000)
    }

    controlBtn.disabled = false
    restartBtn.disabled = false
    backHome.disabled = false
    controlBtn.style.cursor = 'pointer'
    restartBtn.style.cursor = 'pointer'
    backHome.style.cursor = 'pointer'

    let dragonImg = document.querySelector('.dragon')
    dragonImg.src = './assets/icons/dragon2.1.png'

    let backContainer = document.querySelector('.background-container')
    backContainer.style.setProperty('--background-image', "url('./icons/lvl2.png')")

    level2Audio.play()

    currentAudioElement = level2Audio

}

function campaignLevel3() {
    level = 3
    speed = 250

    currentAudioElement.pause()
    currentAudioElement.currentTime = 0

    const level3Audio = audioElements.level3

    let fire = document.querySelector('.firecontainer')
    let fire1 = document.querySelector('.firecontainer1')
    let fire2 = document.querySelector('.firecontainer2')
    fire.src = ''
    fire1.src = ''
    fire2.src = ''

    restartGame()
    if (!isPaused) {
        playAndPause()
    }
    scoreOrganizer()

    // timerInterval = setInterval(updateTimer, 1000)
    if (timerInterval) {
        clearInterval(timerInterval)
        timerInterval = null
    }

    controlBtn.disabled = false
    restartBtn.disabled = false
    backHome.disabled = false
    controlBtn.style.cursor = 'pointer'
    restartBtn.style.cursor = 'pointer'
    backHome.style.cursor = 'pointer'

    let dragonImg = document.querySelector('.dragon')
    dragonImg.src = './assets/icons/dragon3.1.png'

    let backContainer = document.querySelector('.background-container')
    backContainer.style.setProperty('--background-image', "url('./icons/lvl3.png')")

    level3Audio.play()

    currentAudioElement = level3Audio
}

function mainTetrisTable() {
    let tetrisTable = document.createElement('div')
    tetrisTable.classList.add('mainField')

    for (let i = 1; i < 241; i++) {
        let cells = document.createElement('div')
        cells.classList.add('cells')
        tetrisTable.append(cells)
    }

    let main = document.getElementById('main')
    let mainContainer = document.querySelector('.maincontainer')


    if (level === 1) {
        campaignLevel1()
    } else if (level === 2) {
        campaignLevel2()
    } else {
        campaignLevel3()
    }

    main.append(tetrisTable)

    let cells = document.getElementsByClassName('cells')
    let counter = 0

    //adding coordinates to cells
    for (let y = 24; y > 0; y--) {
        for (let x = 1; x < 11; x++) {
            cells[counter].setAttribute('posX', x)
            cells[counter].setAttribute('posY', y)
            counter++
        }
    }

    if (!campaignStart) {
        mainContainer.classList.add('endless-mode')
    }

    scoreOrganizer()
}

function scoreOrganizer() {
    if (campaignStart) {
        if (level === 1) {
            inputScore.value = `Score: ${score}/60`
        } else if (level === 2) {
            inputScore.value = `Score: ${score}/140`
        } else if (level === 3) {
            inputScore.value = `Score: ${score}/220`
        }
    } else {
        inputScore.value = `Score: ${score}`
    }
}

function figuresRandomizer() {
    return Math.round(Math.random() * (figuresArr.length - 1))
}

function colorRandomizer(currentFigure) {
    switch (currentFigure) {
        case 0: return '#0A7B83'
        case 1: return '#2AA876'
        case 2: return '#FFD265'
        case 3: return '#F19C65'
        case 4: return '#CE4D45'
        case 5: return '#0e0a83'
        case 6: return '#f569dd'
    }
}

function figuresCreator(x, y, rotatePosition) {
    if (!isPaused) {
        if (x == 5 && y == 21) {
            rotatePosition = 0
            currentFigure = nextFigure
            nextFigure = figuresRandomizer()
            nextFigureAdder()
        }
        randomColor = colorRandomizer(currentFigure)

        let checkFigure = [
            [x, y],
            [x + figuresArr[currentFigure][rotatePosition][0][0], y + figuresArr[currentFigure][rotatePosition][0][1]],
            [x + figuresArr[currentFigure][rotatePosition][1][0], y + figuresArr[currentFigure][rotatePosition][1][1]],
            [x + figuresArr[currentFigure][rotatePosition][2][0], y + figuresArr[currentFigure][rotatePosition][2][1]]
        ]

        let kick = 0
        let deathFigure = false
        outerLoop: for (let i = 0; i < 4; i++) {
            switch (collisionChecker(checkFigure[i][0], checkFigure[i][1])) {
                case true:
                    deathFigure = true
                    break outerLoop;
                case +1: kick += 1
                    break;
                case -1: kick += -1
                    break;
            }

        }
        if (!deathFigure) {
            figure = [
                document.querySelector(`[posX = "${checkFigure[0][0] + kick}"][posY = "${checkFigure[0][1] + kick}"]`),
                document.querySelector(`[posX = "${checkFigure[1][0] + kick}"][posY = "${checkFigure[1][1] + kick}"]`),
                document.querySelector(`[posX = "${checkFigure[2][0] + kick}"][posY = "${checkFigure[2][1] + kick}"]`),
                document.querySelector(`[posX = "${checkFigure[3][0] + kick}"][posY = "${checkFigure[3][1] + kick}"]`),
            ]
        } else {
            if (rotatePosition == 0) {
                figure = [
                    document.querySelector(`[posX = "${x}"][posY = "${y}"]`),
                    document.querySelector(`[posX = "${x + figuresArr[currentFigure][0][0][0]}"][posY = "${y + figuresArr[currentFigure][0][0][1]}"]`),
                    document.querySelector(`[posX = "${x + figuresArr[currentFigure][0][1][0]}"][posY = "${y + figuresArr[currentFigure][0][1][1]}"]`),
                    document.querySelector(`[posX = "${x + figuresArr[currentFigure][0][2][0]}"][posY = "${y + figuresArr[currentFigure][0][2][1]}"]`),
                ]
            } else {
                figure = [
                    document.querySelector(`[posX = "${x}"][posY = "${y}"]`),
                    document.querySelector(`[posX = "${x + figuresArr[currentFigure][rotatePosition - 1][0][0]}"][posY = "${y + figuresArr[currentFigure][rotatePosition - 1][0][1]}"]`),
                    document.querySelector(`[posX = "${x + figuresArr[currentFigure][rotatePosition - 1][1][0]}"][posY = "${y + figuresArr[currentFigure][rotatePosition - 1][1][1]}"]`),
                    document.querySelector(`[posX = "${x + figuresArr[currentFigure][rotatePosition - 1][2][0]}"][posY = "${y + figuresArr[currentFigure][rotatePosition - 1][2][1]}"]`),
                ]
            }
            rotate = 0
        }
        for (let i = 0; i < figure.length; i++) {
            figure[i].classList.add('figure')
            figure[i].style.backgroundColor = randomColor
        }
    }

}

function collisionChecker(x, y) {
    let cell = document.querySelector(`[posX = "${x}"][posY = "${y}"]`)
    if (x < 1) {
        return +1
    } else if (x > 10) {
        return -1
    } else if (cell.classList.contains('deadfigure')) {
        return true
    }

}
function nextFigureTetrisTable() {
    let nextFigureTable = document.createElement('div')
    nextFigureTable.classList.add('additionalField')

    for (let i = 1; i < 17; i++) {
        let ncells = document.createElement('div')
        ncells.classList.add('ncells')
        nextFigureTable.append(ncells)
    }

    let main = document.getElementById('addmain')
    main.append(nextFigureTable)

    let ncells = document.getElementsByClassName('ncells')
    let counter = 0

    for (let y = 4; y > 0; y--) {
        for (let x = 1; x < 5; x++) {
            ncells[counter].setAttribute('possX', x)
            ncells[counter].setAttribute('possY', y)
            counter++
        }
    }
}

function nextFigureAdder() {
    if (!isPaused) {

        let nextFigureColor = colorRandomizer(nextFigure)

        let x = 2
        let y = 2

        let nextFigureDraw = [
            document.querySelector(`[possX = "${x}"][possY = "${y}"]`),
            document.querySelector(`[possX = "${x + figuresArr[nextFigure][0][0][0]}"][possY = "${y + figuresArr[nextFigure][0][0][1]}"]`),
            document.querySelector(`[possX = "${x + figuresArr[nextFigure][0][1][0]}"][possY = "${y + figuresArr[nextFigure][0][1][1]}"]`),
            document.querySelector(`[possX = "${x + figuresArr[nextFigure][0][2][0]}"][possY = "${y + figuresArr[nextFigure][0][2][1]}"]`),
        ]
        let miniMap = document.getElementsByClassName("ncells")
        for (let cell of miniMap) {
            if (cell.classList.contains("figure")) {
                cell.classList.remove('figure')
                cell.style.removeProperty('background-color')
            }

        }

        let addFiel = document.querySelector('.additionalField')

        for (let i = 0; i < nextFigureDraw.length; i++) {
            if (nextFigure == 1 || nextFigure == 2) {
                addFiel.style.marginLeft = '0rem'
                nextFigureDraw[i].classList.add('figure')
                nextFigureDraw[i].style.backgroundColor = nextFigureColor
            } else {
                addFiel.style.marginLeft = '1.5rem'
                nextFigureDraw[i].classList.add('figure')
                nextFigureDraw[i].style.backgroundColor = nextFigureColor
            }
        }
    }
}

//adding down moving logic
function figuresDownMover() {
    if (!isPaused) {
        let mover = true

        //getting coordinates of figure
        let coords = [
            [figure[0].getAttribute('posX'), figure[0].getAttribute('posY')],
            [figure[1].getAttribute('posX'), figure[1].getAttribute('posY')],
            [figure[2].getAttribute('posX'), figure[2].getAttribute('posY')],
            [figure[3].getAttribute('posX'), figure[3].getAttribute('posY')],
        ]

        for (let i = 0; i < coords.length; i++) {
            //if coord along y-axis equals 1 or in coords along x/y-axises 
            //in every figure under the new fig class equals "stopped figure" than new fig stops moving
            if (coords[i][1] == 1 || document.querySelector(`[posX = "${coords[i][0]}"][posY = "${coords[i][1] - 1}"]`).classList.contains('deadfigure') || isPaused === true) {
                mover = false
                break
            }
        }

        if (mover) {
            for (let i = 0; i < figure.length; i++) {
                figure[i].classList.remove('figure')
                figure[i].style.removeProperty('background-color')
            }

            //decreasing y-position for figure to "move down"
            figure = [
                document.querySelector(`[posX = "${coords[0][0]}"][posY = "${coords[0][1] - 1}"]`),
                document.querySelector(`[posX = "${coords[1][0]}"][posY = "${coords[1][1] - 1}"]`),
                document.querySelector(`[posX = "${coords[2][0]}"][posY = "${coords[2][1] - 1}"]`),
                document.querySelector(`[posX = "${coords[3][0]}"][posY = "${coords[3][1] - 1}"]`),
            ]

            for (let i = 0; i < figure.length; i++) {
                figure[i].classList.add('figure')
                figure[i].style.backgroundColor = randomColor
            }
        } else {
            for (let i = 0; i < figure.length; i++) {
                figure[i].classList.remove('figure')
                figure[i].style.removeProperty('background-color')

                figure[i].classList.add('deadfigure')
            }
            rotate = 0

            gameOverChecker = gameOver()
            figuresRemover()
            if (!gameOverChecker) {
                figuresCreator(5, 21, 0)
            }
        }
    }
}

function dragon() {
    const dragon = document.getElementById('track4')
    dragon.play()

    dragon.addEventListener('ended', function () {
        dragon.pause()
        dragon.currentTime = 0
    })
}

function figuresRemover() {
    for (let rows = 1; rows < 21; rows++) {
        let counter = 0
        for (let columns = 1; columns < 11; columns++) {
            if (document.querySelector(`[posX = "${columns}"][posY = "${rows}"]`).classList.contains('deadfigure')) {
                counter++
                if (counter == 10) {
                    score += 10
                    scoreOrganizer()

                    let dragonImg = document.querySelector('.dragon')
                    let fire = document.querySelector('.firecontainer')
                    let fire1 = document.querySelector('.firecontainer1')
                    let fire2 = document.querySelector('.firecontainer2')
                    if (campaignStart) {

                        switch (level) {
                            case 1:
                                if (score >= 30 && score < 60) {
                                    speed = 400;
                                    dragonImg.src = './assets/icons/dragon1.2.png'
                                }
                                if (score === 60) {
                                    dragonImg.src = './assets/icons/dragon1.3.png'
                                }
                                break
                            case 2:
                                if (score >= 80 && score <= 140) {
                                    fire.src = './assets/icons/fire1.png'
                                }
                                if (score >= 80 && score <= 140) {
                                    fire1.src = './assets/icons/fire2.png'
                                }
                                if (score >= 110 && score <= 140) {
                                    fire2.src = './assets/icons/fire3.png'
                                    controlBtn.disabled = true
                                }

                                if (score >= 60 && score <= 140) {
                                    dragonImg.src = './assets/icons/dragon2.2.png'
                                    dragon()
                                }
                                if (score >= 100) {
                                    speed = 250
                                }
                                if (score === 140) {
                                    dragonImg.src = './assets/icons/dragon2.3.png'
                                }
                                break
                            case 3:
                                if (score >= 120 && score <= 220) {
                                    fire.src = './assets/icons/fire1.png'
                                }
                                if (score >= 120 && score <= 220) {
                                    fire1.src = './assets/icons/fire2.png'
                                }
                                if (score >= 150 && score <= 220) {
                                    fire2.src = './assets/icons/fire3.png'
                                    controlBtn.disabled = true
                                }

                                if (score >= 80 && score <= 220) {
                                    dragonImg.src = './assets/icons/dragon3.2.png'
                                    let dragonContainer = document.querySelector('.dragoncontainer')
                                    dragonContainer.style.marginLeft = '0'
                                }
                                if (score >= 110 && score <= 220) {
                                    speed = 200
                                    dragonImg.src = './assets/icons/dragon3.3.png'
                                    dragon()
                                }
                                if (score === 220) {
                                    dragonImg.src = './assets/icons/dragon3.4.png'
                                }
                                break
                        }
                    }
                        nextLevel()

                        for (let row = 1; row < 11; row++) {
                            document.querySelector(`[posX = "${row}"][posY = "${rows}"]`).classList.remove('deadfigure')
                        }

                        //falling down of all figures after removing whole row
                        let deadfigure = document.querySelectorAll('.deadfigure')
                        let newField = []

                        for (let deadloop = 0; deadloop < deadfigure.length; deadloop++) {
                            let deadCoords = [deadfigure[deadloop].getAttribute('posX'), deadfigure[deadloop].getAttribute('posY')]

                            //for not changing place of rows that are under the removed row
                            if (deadCoords[1] > rows) {
                                deadfigure[deadloop].classList.remove('deadfigure')
                                newField.push(document.querySelector(`[posX = "${deadCoords[0]}"][posY = "${deadCoords[1] - 1}"]`))
                            }
                        }

                        //adding a class for changed field
                        for (let d = 0; d < newField.length; d++) {
                            newField[d].classList.add('deadfigure')
                        }
                        rows--
                    }
                }
            }
        }
    }


function figuresRotater() {
    if (rotate > 3) {
        rotate = 0
    }
    let centerX = parseInt(figure[0].getAttribute('posX'))
    let centerY = parseInt(figure[0].getAttribute('posY'))

    if (centerX == 5 && centerY == 21) {
        return
    }

    for (let i = 0; i < figure.length; i++) {
        figure[i].classList.remove('figure')
        figure[i].style.removeProperty('background-color')
    }
    figuresCreator(centerX, centerY, rotate)
}

function figuresRightLeftMover(a) {
    let positioner = true

    let coord1 = [figure[0].getAttribute('posX'), figure[0].getAttribute('posY')]
    let coord2 = [figure[1].getAttribute('posX'), figure[1].getAttribute('posY')]
    let coord3 = [figure[2].getAttribute('posX'), figure[2].getAttribute('posY')]
    let coord4 = [figure[3].getAttribute('posX'), figure[3].getAttribute('posY')]

    let newFigureState = [
        document.querySelector(`[posX = "${+coord1[0] + a}"][posY = "${coord1[1]}"]`),
        document.querySelector(`[posX = "${+coord2[0] + a}"][posY = "${coord2[1]}"]`),
        document.querySelector(`[posX = "${+coord3[0] + a}"][posY = "${coord3[1]}"]`),
        document.querySelector(`[posX = "${+coord4[0] + a}"][posY = "${coord4[1]}"]`),
    ]

    //checking if we can move right or left
    for (let i = 0; i < newFigureState.length; i++) {
        if (!newFigureState[i] || newFigureState[i].classList.contains('deadfigure') || isPaused === true) {
            positioner = false
        }
    }

    if (positioner) {
        for (let i = 0; i < figure.length; i++) {
            figure[i].classList.remove('figure')
            figure[i].style.removeProperty('background-color')
        }

        figure = newFigureState

        for (let i = 0; i < figure.length; i++) {
            figure[i].classList.add('figure')
            figure[i].style.backgroundColor = randomColor
        }
    }
}

function gameOver() {
    for (let i = 1; i < 11; i++) {
        if (document.querySelector(`[posX= "${i}"][posY= "${20}"]`).classList.contains('deadfigure')) {
            clearInterval(interval)
            clearInterval(timerInterval)
            if (!gameOverChecker) {
                if (!campaignStart) {
                    let gameoverOverlay = document.querySelector('.gameover-overlay')
                    gameoverOverlay.style.height = '450px'
                    scoreTable()
                } else {
                    let gameoverOverlay = document.querySelector('.gameover-overlay')
                    let gameoverContainer = document.querySelector('.gameover-container')
                    let scoreTable = document.querySelector('.gameover-scoretable')
                    let backtomenuBtn = document.querySelector('.backtomenu-btn')
                    let tryagainBtn = document.querySelector('.tryagain-btn')
                    gameoverOverlay.classList.add('show-overlay')
                    gameoverContainer.textContent = `Game over. You scored ${score} points.`
                    scoreTable.style.display = "none"

                    backtomenuBtn.addEventListener('click', function () {
                        location.reload()
                    })

                    tryagainBtn.addEventListener('click', function () {
                        gameoverOverlay.classList.remove('show-overlay')
                        restartGame()
                        timerInterval = setInterval(updateTimer, 1000)
                        controlBtn.disabled = false
                        seeresultBtn.disabled = false
                        restartBtn.disabled = false
                        controlBtn.style.cursor = 'pointer'
                        restartBtn.style.cursor = 'pointer'
                    })
                }
            }
            gameOverChecker = true
            return true
        }
    }
}

function scoreTable() {
    let scoreOverlay = document.querySelector('.score-overlay')
    let scoreNamefield = document.querySelector('.score-namefield')
    let seeresultBtn = document.querySelector('.seeresult-btn')
    scoreOverlay.classList.add('show-overlay')
    if (!seeresultBtn.hasEventListener) {
        seeresultBtn.addEventListener('click', (e) => {
            let time = inputTimer.value.toString()
            seeresultBtn.disabled = true
            e.stopPropagation()
            let scoreResult = {
                'name': scoreNamefield.value,
                'score': score.toString(),
                'time': time.replace(/^Timer: /, '')
            }
            console.log(scoreResult)
            fetch('/writeScore', { method: 'POST', body: JSON.stringify(scoreResult) })
                .then(() => {
                    fetch('http://localhost:8080/readScore')
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.json();
                        })
                        .then(data => {
                            scoreOverlay.classList.remove('show-overlay')

                            let gameoverContainer = document.querySelector('.gameover-container')
                            let gameoverOverlay = document.querySelector('.gameover-overlay')
                            let backtomenuBtn = document.querySelector('.backtomenu-btn')
                            let tryagainBtn = document.querySelector('.tryagain-btn')
                            let gameoverScoretable = document.querySelector('.gameover-scoretable')
                            gameoverOverlay.classList.add('show-overlay')

                            backtomenuBtn.addEventListener('click', function () {
                                location.reload()
                            })

                            tryagainBtn.addEventListener('click', function () {
                                gameoverOverlay.classList.remove('show-overlay')
                                restartGame()
                                timerInterval = setInterval(updateTimer, 1000)
                                gameoverScoretable.innerHTML = ''
                                ArrowContainer.innerHTML = ''
                                controlBtn.disabled = false
                                restartBtn.disabled = false
                                controlBtn.style.cursor = 'pointer'
                                restartBtn.style.cursor = 'pointer'
                            })
                            let user = data[data.length - 1].name
                            data = data.sort((a, b) => b.score - a.score)
                            let gameoverScoretablePage
                            for (let i = 0; i < data.length; i++) {
                                let scoreRow = document.createElement('div')
                                scoreRow.className = "score-row"
                                let scoreRank = document.createElement('div')
                                scoreRank.textContent = i + 1
                                let scoreName = document.createElement('div')
                                scoreName.textContent = data[i].name
                                let scoreAmount = document.createElement('div')
                                scoreAmount.textContent = data[i].score
                                let scoreTime = document.createElement('div')
                                scoreTime.textContent = data[i].time
                                scoreRow.append(scoreRank, scoreName, scoreAmount, scoreTime)
                                if (user == data[i].name) {
                                    gameoverContainer.textContent = `Congrats ${user}, you are on the ${i + 1} position.`
                                }
                                if (i == 0 || i % 5 == 0) {
                                    gameoverScoretablePage = document.createElement('div')
                                    gameoverScoretablePage.className = `page ${i / 5 + 1}`
                                    gameoverScoretablePage.appendChild(scoreRow)
                                    gameoverScoretable.appendChild(gameoverScoretablePage)
                                    if (i != 0) {
                                        gameoverScoretablePage.style.display = "none"
                                    }
                                } else {
                                    gameoverScoretablePage.appendChild(scoreRow)
                                }
                            }
                            let ArrowContainer = document.createElement('div')
                            ArrowContainer.classList.add('arrow-container')
                            let leftArrow = document.createElement('div')
                            leftArrow.textContent = "<"
                            leftArrow.classList.add('arrows')
                            let rightArrow = document.createElement('div')
                            rightArrow.textContent = ">"
                            rightArrow.classList.add('arrows')
                            let pageNumber = document.createElement('div')
                            let currentPage = 1
                            pageNumber.textContent = currentPage

                            ArrowContainer.append(leftArrow, pageNumber, rightArrow)
                            gameoverOverlay.insertBefore(ArrowContainer, gameoverScoretable.nextSibling)
                            rightArrow.addEventListener('click', () => {
                                if (currentPage < data.length / 5) {
                                    currentPage++;
                                    const pages = document.querySelectorAll('.page');
                                    for (let i = 0; i < pages.length; i++) {
                                        pages[i].style.display = 'none';
                                    }

                                    const selectedPage = document.querySelector(`div[class='page ${currentPage}']`);
                                    if (selectedPage) {
                                        selectedPage.style.display = 'block';
                                    }
                                    pageNumber.textContent = currentPage;
                                }
                            })
                            leftArrow.addEventListener('click', () => {
                                if (currentPage > 1) {
                                    currentPage--;
                                    const pages = document.querySelectorAll('.page');
                                    for (let i = 0; i < pages.length; i++) {
                                        pages[i].style.display = 'none';
                                    }

                                    const selectedPage = document.querySelector(`div[class='page ${currentPage}']`);
                                    if (selectedPage) {
                                        selectedPage.style.display = 'block';
                                    }
                                    pageNumber.textContent = currentPage;
                                }
                            })
                        })
                        .catch(error => {
                            console.error('Fetch error:', error);
                        });
                })
        })
        seeresultBtn.hasEventListener = true;
    }


}

function drop() {
    let nowTime = Date.now()
    let delta = nowTime - dropStart
    if (!gameOverChecker) {
        if (delta > speed) {
            if (!isPaused) {
                figuresDownMover()
                dropStart = nowTime
            }
        }
        requestAnimationFrame(drop)
    }
}

startWindow()
startCampaignWindow()