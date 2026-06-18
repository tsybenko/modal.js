export interface Plugin {
  name: string,
  methods: Record<string, (event: Event, element: HTMLElement) => void>
}