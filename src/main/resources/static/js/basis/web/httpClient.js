export const httpClient = {}

httpClient.requestPermissionToEdit = () =>
    fetch("workbook")
        .then(response => {
            // Authentication
            if (response.status === 401) return false
            else if (response.ok) return true
            else throw new Error(response.status)
        })

httpClient.downloadFile = () =>
    fetch("file")
        .then(res => res.blob())
        .then()
        .catch(err => alert(err))
