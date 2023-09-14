import { startGameFromStory, currentAudioElement } from './game.js'

export let plotText, plotText1, imageContainer, arrow, arrowImg
export const timeline = [1000, 5000, 6000, 7000, 8000, 10000, 11000]
export let paragraphs = []
export let pageNumber = 0
export let nextPageBtn
export let campaignStart = false

export function startCampaignWindow() {
    let startCampaign = document.querySelector('.start-campaign-button')
    startCampaign.addEventListener('click', function () {
        currentAudioElement.play()

        campaignStart = true

        let startOverlay = document.querySelector('.start-overlay')
        let startBtn = document.querySelector('.start-campaign-button')
        let plotOverlay = document.querySelector('.plot-overlay')

        startOverlay.hidden = true
        startBtn.hidden = true
        plotOverlay.hidden = false

        // startGameFromStory()

            let plotContainer = document.createElement('div')
            imageContainer = document.createElement('div')

            imageContainer.classList.add('image-container')
            plotContainer.classList.add('plot-container')

            plotText = document.createElement('p')
            plotText1 = document.createElement('p')
            let nextPage = document.createElement('div')
            arrow = document.createElement('button')
            arrowImg = document.createElement('img')
            arrowImg.hidden = true

            nextPage.classList.add('next-page')
            arrow.classList.add('arrow-button')
            arrowImg.classList.add('arrow')
            plotText.classList.add('plot-text')
            plotText1.classList.add('plot-text1')

            arrow.append(arrowImg)
            nextPage.append(arrow)
            plotContainer.append(plotText, imageContainer, plotText1, nextPage)
            plotOverlay.append(plotContainer)

            arrow.disabled = true
            arrow.style.cursor = 'default'

            nextPageBtn = document.querySelector('.arrow-button')

            fetch('./assets/plot.txt')
                .then(response => response.text())
                .then(text => {
                    paragraphs = text.split('\n')
                    firstPage()
                    arrow.classList.add('page1')

                    nextPageBtn.addEventListener('click', () => {
                        if (arrow.classList.contains('page1')) {
                            arrow.classList.remove('page1')
                            arrow.classList.add('page2')
                            secondPage()
                        } else if (arrow.classList.contains('page2')) {
                            arrow.classList.remove('page2')
                            arrow.classList.add('page3')
                            thirdPage()
                        } else if (arrow.classList.contains('page3')) {
                            arrow.classList.remove('page3')
                            arrow.classList.add('page4')
                            fourthPage()
                        } else if (arrow.classList.contains('page4')) {
                            arrow.classList.remove('page4')
                            arrow.classList.add('page5')
                            fifthPage()
                        }
                    })
                })
    })
}

export function nextPage() {
    arrowImg.hidden = true
    arrow.hidden = true

    let nextPageTiming

    if (pageNumber === 1 || pageNumber === 3 || pageNumber === 4 || pageNumber === 5) {
        nextPageTiming = timeline[6]
    } else {
        nextPageTiming = timeline[5]
    }

    setTimeout(() => {
        arrow.disabled = false
        arrowImg.hidden = false
        arrow.hidden = false
        arrow.style.cursor = 'pointer'

        arrowImg.src = './assets/icons/next-page.svg'
        arrowImg.addEventListener('mouseenter', () => {
            arrowImg.src = './assets/icons/next-page-hover.svg'
        })

        arrowImg.addEventListener('mouseleave', () => {
            arrowImg.src = './assets/icons/next-page.svg'
        })

    }, nextPageTiming)

}

export function cleaner() {
    plotText.style.animation = "none"
    plotText.offsetHeight
    plotText.style.animation = null
    plotText.textContent = ""

    plotText1.style.animation = "none"
    plotText1.offsetHeight
    plotText1.style.animation = null
    plotText1.textContent = ""

    imageContainer.innerHTML = ""
    arrow.hidden = true
    arrow.disabled = true
}

export function firstPage() {
    pageNumber = 1

    setTimeout(() => {
        let firstParagraph = paragraphs[0]
        plotText.textContent = firstParagraph
    }, timeline[0])

    setTimeout(() => {
        let girlImage = document.createElement('img')
        girlImage.src = './assets/icons/girl.png'
        girlImage.classList.add('girl-image')
        imageContainer.append(girlImage)
    }, timeline[1])

    setTimeout(() => {
        let phoneImage = document.createElement('img')
        phoneImage.src = './assets/icons/tetris-phone.png'
        phoneImage.classList.add('phone-image')
        imageContainer.append(phoneImage)
    }, timeline[1])

    setTimeout(() => {
        if (paragraphs.length > 1) {
            let secondParagraph = paragraphs[1]
            plotText1.textContent = secondParagraph
        }
    }, timeline[4])

    nextPage()
}

export function secondPage() {
    pageNumber = 2

    cleaner()

    setTimeout(() => {
        let firstParagraph = paragraphs[2]
        plotText.textContent = firstParagraph
    }, timeline[0])

    setTimeout(() => {
        let girlImage = document.createElement('img')
        girlImage.src = './assets/icons/casino.png'
        girlImage.classList.add('girl-image')
        imageContainer.append(girlImage)
    }, timeline[1])

    setTimeout(() => {
        if (paragraphs.length > 1) {
            let secondParagraph = paragraphs[3]
            plotText1.textContent = secondParagraph
        }
    }, timeline[3])

    nextPage()
}

export function thirdPage() {
    pageNumber = 3

    cleaner()

    setTimeout(() => {
        let firstParagraph = paragraphs[4]
        plotText.textContent = firstParagraph
    }, timeline[0])

    setTimeout(() => {
        let girlImage = document.createElement('img')
        girlImage.src = './assets/icons/window.png'
        girlImage.classList.add('girl-image')
        imageContainer.append(girlImage)
    }, timeline[1])

    setTimeout(() => {
        let phoneImage = document.createElement('img')
        phoneImage.src = './assets/icons/crowd.png'
        phoneImage.classList.add('phone-image')
        imageContainer.append(phoneImage)
    }, timeline[1])

    setTimeout(() => {
        if (paragraphs.length > 1) {
            let secondParagraph = paragraphs[5]
            secondParagraph = secondParagraph.replace('planks.', 'planks.\n')
            plotText1.textContent = secondParagraph
        }
    }, timeline[4])

    nextPage()
}

export function fourthPage() {
    pageNumber = 4

    cleaner()

    setTimeout(() => {
        let firstParagraph = paragraphs[6]
        plotText.textContent = firstParagraph
    }, timeline[0])

    setTimeout(() => {
        let girlImage = document.createElement('img')
        girlImage.src = './assets/icons/angry-woman.png'
        girlImage.classList.add('girl-image')
        imageContainer.append(girlImage)
    }, timeline[1])

    setTimeout(() => {
        let girlImage = document.createElement('img')
        girlImage.src = './assets/icons/monk.png'
        girlImage.classList.add('girl-image')
        imageContainer.append(girlImage)
    }, timeline[1])

    setTimeout(() => {
        if (paragraphs.length > 1) {
            let secondParagraph = paragraphs[7]
            plotText1.textContent = secondParagraph
        }
    }, timeline[4])

    nextPage()
}

export function fifthPage() {
    pageNumber = 5

    cleaner()

    setTimeout(() => {
        let combinedParagraph = paragraphs[8] + '\n' + paragraphs[9]
        plotText.textContent = combinedParagraph
    }, timeline[0])

    setTimeout(() => {
        let girlImage = document.createElement('img')
        girlImage.src = './assets/icons/princess.png'
        girlImage.classList.add('princess-image')
        imageContainer.append(girlImage)
    }, timeline[3])

    setTimeout(() => {
        if (paragraphs.length > 1) {
            let secondParagraph = paragraphs[10]
            plotText1.textContent = secondParagraph
        }
    }, timeline[5])

    nextPage()

    let plotOverlay = document.querySelector('.plot-overlay')

    nextPageBtn.addEventListener('click', function(){
        if(arrow.classList.contains('page5')){
            plotOverlay.hidden = true
            startGameFromStory()
        }
    })
}

export function endCleaner() {
    let princessResponse1 = document.querySelector('.princess-response1')
    let princessResponse2 = document.querySelector('.princess-response2')
    let goodbyeText = document.querySelector('.goodbye-text')
    princessResponse2.style.animation = "none"
    princessResponse2.offsetHeight
    princessResponse2.style.animation = null
    princessResponse1.textContent = ''
    princessResponse2.textContent = ''
    goodbyeText.textContent = ''
}

export function ending() {
    let endingOverlay = document.querySelector('.ending-overlay')
    let goodbyeOverlay = document.querySelector('.goodbye-overlay')
    endingOverlay.classList.add('show-overlay')

    let princessImg = document.querySelector('.princess-img')
    let goodbyeText = document.querySelector('.goodbye-text')
    let backtomenuBtn = document.querySelector('.backtomenu')
    let princessResponse1 = document.querySelector('.princess-response1')
    let princessResponse2 = document.querySelector('.princess-response2')
    let button1 = document.querySelector('.butt-1')
    let button2 = document.querySelector('.butt-2')

    princessImg.src = './assets/icons/princess1.png'
    princessResponse1.textContent = 'Well... Didn\'t expect to meet you here.'
    princessResponse2.textContent = 'I guess I have to say "thank you"?'
    button1.textContent = 'I did it just because of the audits ratio'
    button2.textContent = 'Will you marry me?'

    button2.addEventListener('click', function () {
        endCleaner()

        princessImg.src = './assets/icons/princess_amus.png'
        princessResponse1.textContent = 'Marry you? Everything is going so fast, I\'m not sure I\'m ready.'
        princessResponse2.textContent = 'Let\'s be friends.'
        button1.hidden = true
        button2.hidden = true

        setTimeout(() => {
            goodbyeOverlay.classList.add('show-overlay')
            goodbyeText.textContent = 'Congratulations! You unlocked the first of four endings. I don\'t think you should be so pushy, dude.'
        }, 4000)
    })

    button1.addEventListener('click', function () {
        endCleaner()

        princessImg.src = './assets/icons/princess_anger.png'
        princessResponse1.textContent = 'What?? I thought you were different.'
        princessResponse2.textContent = 'But you are like all of them...'
        button1.textContent = 'I don\'t even like you'
        button2.textContent = 'I am sorry, that\'s not what I meant'

        button1.classList.add('step-2-1')
        button2.classList.add('step-2-2')

        if (button1.classList.contains('step-2-1') && button2.classList.contains('step-2-2')) {
            button1.addEventListener('click', function () {
                endCleaner()

                princessImg.src = './assets/icons/princess_amus.png'
                princessResponse1.textContent = 'Then why did you help me??'
                princessResponse2.textContent = 'That\'s so stupid!'
                button1.textContent = 'I just like cheese "Cheetos" too'
                button2.textContent = 'I just like bacon "Cheetos" too'

                button1.classList.add('step-3-1')
                button2.classList.add('step-3-2')

                if (button1.classList.contains('step-3-1') && button2.classList.contains('step-3-2')) {
                    button1.addEventListener('click', function () {
                        endCleaner()

                        princessImg.src = './assets/icons/princess_joy.png'
                        princessResponse1.textContent = 'Cheese "Cheetos"? We\'re so alike...'
                        princessResponse2.textContent = 'Maybe we\'ll go to the "Monk" one day, huh?'
                        button1.hidden = true
                        button2.hidden = true

                        setTimeout(() => {
                            goodbyeOverlay.classList.add('show-overlay')
                            goodbyeText.textContent = 'Congratulations! You unlocked the best of four endings. Do not choke on your vanity, pf.'
                        }, 4000)
                    })
                    button2.addEventListener('click', function () {
                        endCleaner()

                        princessImg.src = './assets/icons/princess_anger.png'
                        princessResponse1.textContent = 'Bacon "Cheetos"?! I hate them!'
                        princessResponse2.textContent = 'Just like I hate you!!!!!'
                        button1.hidden = true
                        button2.hidden = true

                        setTimeout(() => {
                            goodbyeOverlay.classList.add('show-overlay')
                            goodbyeText.textContent = 'Congratulations! You unlocked the worst of four endings.. Wow, didn\'t even know that it could be so-o-o bad. I am proud of your miserability!'
                        }, 4000)
                    })
                }

            })
            button2.addEventListener('click', function () {
                endCleaner()

                princessImg.src = './assets/icons/princess_amus.png'
                princessResponse1.textContent = 'Ugh.. you such... Can you finally stop making excuses?'
                princessResponse2.textContent = 'I don\'t want to know you anymore!'
                button1.hidden = true
                button2.hidden = true

                setTimeout(() => {
                    goodbyeOverlay.classList.add('show-overlay')
                    goodbyeText.textContent = 'Congratulations! You unlocked the worst of four endings. Keep up, dude, you\'ll definitely be single for the rest of your life.'
                }, 4000)

            })
        }
    })

    backtomenuBtn.addEventListener('click', function () {
        location.reload()
    })
}


