export interface Book {
    id: string,
    title: string,
    authors: string[],
    year?: number,
    rating?: number,
    ISBN?: string,
}

export interface GroupedBooks {
    year: number,
    books: Book[]
}
