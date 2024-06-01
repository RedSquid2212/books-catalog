export interface Book {
    title: string,
    authors: string[],
    year?: number,
    rating?: number,
    ISBN?: string,
    id?: string
}

export interface GroupedBooks {
    year: number,
    books: Book[]
}
