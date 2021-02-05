import moment from 'moment';

export function formatDate(date, format) {
    return moment(date).format(format)
}

export function truncate(str, len) {
    if (str.length > 0 && str.length > len) {
        return str.substr(0, len) + '...'
    }
    return str
}

export function stripTags(input) {
    return input.replace(/<(?:.|\n)*?>/gm, '')
}

export function editIcon(storyUser, loggedUser, storyId, floating = true) {
    if (storyUser._id.toString() == loggedUser._id.toString()) {
        if (floating) {
            return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab grey darken-2"><i class="fas fa-edit fa-small"></i></a>`;
        } else {
            return`<a href="/stories/edit/${storyId}"><i class="fas fa-edit"></i></a>`;
        }
    }
    return ''
}

export function select(selected, option) {
    return (selected == option) ? 'selected="selected"' : '';
}