export type selectable = {
    displayName: string
    captureColor: string
    runningMode: string
}

export const photo: selectable = {
    displayName: 'Photo',
    captureColor: '#FFFFFF',
    runningMode: 'image',
}

export const video: selectable = {
    displayName: 'Video',
    captureColor: '#DD1C1A',
    runningMode: 'video',
}

export const coach: selectable = {
    displayName: 'Coach',
    captureColor: '#003D5B',
    runningMode: 'live',
}


