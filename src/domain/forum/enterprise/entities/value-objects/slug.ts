export class Slug {
    public value: string

    private constructor(value: string) {
        this.value = value
    }
    

    static create(slug: string) {
        return new Slug(slug)
    }
    /**
     * Receive a string and normalize it as a slug
     * 
     * Example: "não pega na minha mão": "nao-pega-na-minha-mao"
     * @param text 
     */
    static createFromText(text: string) {
        const slugText = text
            .normalize('NFKD') // Uses a unix normalization conversion 
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-') // Replace spaces with "-"
            .replace(/[^\w-]+/g, '') // Remove symbols
            .replace(/_/g, '-') // Remove underlines
            .replace(/--+/g, '-') // Replace "--" with "-"
            .replace(/-$/g, '') // Remove "-" at the end of the string

        return new Slug(slugText)
    }
}