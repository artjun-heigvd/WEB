/**
 * Module that contains the clicker game
 *
 *
 */
export module Clicker {

    /**
     * The message type
     */
    type Message = {
        type: string;
        value: number;
    };

    /**
     * Class that represents the clicker game
     */
    export class Click {
        private static clicksThreshold: number = 60;
        private static animals: string[] = ['sheep', 'cow', 'pig', 'goat', 'cat', 'chicken'];
        private currentIndex: number;
        private globalClicks: number;
        private currentNbClicks: number;
        private readonly sendMessage: Function;

        constructor(sendMessage: Function) {
            this.currentNbClicks = 0;
            this.globalClicks = 0;
            this.sendMessage = sendMessage;
            this.currentIndex = 0;
        }

        /**
         * Handle click event
         * @param nbClicks number of clicks
         */
        click(nbClicks: number): void {
            this.currentNbClicks += nbClicks;
            this.globalClicks += nbClicks;
            if (this.currentNbClicks >= Click.clicksThreshold) {
                this.currentNbClicks = 0
                this.currentIndex = (++this.currentIndex) % Click.animals.length;
                this.sendMessage(JSON.stringify({type: "changePet", value: Click.animals[this.currentIndex]}));
            }
            this.sendMessage(JSON.stringify({
                type: 'nbGlobalClicks',
                current: this.currentNbClicks,
                global: this.globalClicks
            }));
        }

        /**
         * Get the current number of clicks
         */
        getCurrentNbClicks(): number {
            return this.currentNbClicks;
        }


        /**
         * Get the global number of clicks
         */
        getGlobalClicks(): number {
            return this.globalClicks;
        }


        /**
         * Get the current pet to display
         */
        getPet(): string {
            return Click.animals[this.currentIndex];
        }

        /**
         * Handle incoming messages
         * @param message The message
         */
        onMessage(message: Message): void {
            if (message.type === 'click') {
                this.click(message.value);
            } else if (message.type === 'word') {
                this.getWord().then(word => this.sendMessage(JSON.stringify({type: 'word', value: word})));
            }
        }

        /**
         * Fetch a random english word from an API
         */
        async getWord(): Promise<string> {
            try {
                const response = await fetch('https://random-word-api.herokuapp.com/word?lang=en');
                const data = await response.json() as string[];
                return data[0]; // The API returns an array with a single word
            } catch (error) {
                console.error('Failed to fetch word:', error);
                return '';
            }
        }
    }
}