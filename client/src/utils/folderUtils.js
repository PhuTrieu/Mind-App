import { graphQLRequest } from "./request";

export const foldersLoader = async () => { 
    const query = `query Folders {
        folders {
            id
            name
            createdAt
        }
    }`
    const data = await graphQLRequest({query})
    return data;
}

export const addNewFolder = async (newFolder) => { 
    const query = `mutation Mutation($name: String!) {
        addFolder(name: $name) {
            name
            author {
                name
            }
        }
    }`
    const data = await graphQLRequest({
        query,
        variables: {
            name: newFolder.name
        }
    })
    return data;
}

export const updateFolder = async (editFolder) => { 
    const query = `mutation Mutation($id: String!, $name: String!) {
        updateFolder(id:$id, name: $name) {
            id
            name
        }
    }`
    const data = await graphQLRequest({
        query,
        variables: {
            id: editFolder.id,
            name: editFolder.name
        }
    })
    return data;
}

export const deleteFolder = async (folderId) => {
    const query = `mutation Mutation($id: String!) {
        deleteFolder(id: $id) {
            id
        }
    }`
    const data = await graphQLRequest({
        query,
        variables: {
            id: folderId
        }
    })
    return data;
}