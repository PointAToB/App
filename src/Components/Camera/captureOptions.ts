export type Option = {
    displayName: string,
    captureColor: string,
    runningMode: string
}

const photo: Option = {
    displayName: 'Photo',
    captureColor: '#FFFFFF',
    runningMode: 'image'
}

const video: Option = {
    displayName: 'Video',
    captureColor: '#DD1C1A',
    runningMode: 'video'
}

const coach: Option = {
    displayName: 'Coach',
    captureColor: '#003D5B',
    runningMode: 'live'
}

export const Options: Option[] = [video, photo, coach]


