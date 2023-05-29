import {
  Component,
  Renderer2,
  OnInit,
  ElementRef,
  ViewChildren,
  QueryList,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import getPokemonData, { Pokemon } from './listPokemon';

interface ICompare {
  id: number;
  element: HTMLElement;
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements AfterViewInit {
  pokemons: Promise<Pokemon[]> = getPokemonData();
  listPokemon: Pokemon[] = [];
  compare: ICompare[] = [];
  point: number = 0;
  minutes: number = 3;
  seconds: number = 0;
  intervalId: any;
  scores: number = 0;
  localStorage: Storage = window.localStorage;
  user = this.localStorage.getItem('user');

  @ViewChildren('cardElement') listCard!: QueryList<ElementRef>;
  @ViewChild('start') startBtn!: ElementRef;
  @ViewChild('soundClick') soundClick!: ElementRef;
  @ViewChild('soundEat') soundEat!: ElementRef;
  @ViewChild('soundOver') soundOver!: ElementRef;

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.listCard.changes.subscribe(() => {
      this.listCard.forEach((card: ElementRef) => {
        card.nativeElement.onclick = () => this.onClickCard(card.nativeElement);
      });
    });
  }

  async getPokemonData() {
    await this.pokemons.then((pokemon) => {
      pokemon.forEach((p) => this.listPokemon.push(p));
    });
    this.listPokemon.push(...this.listPokemon);
    this.listPokemon = this.listPokemon.sort(() => Math.random() - 0.5);
  }

  async startGame() {
    this.scores = 0;
    this.point = 0;
    this.minutes = 3;
    this.seconds = 0;
    this.renderer.setStyle(this.startBtn.nativeElement, 'display', 'none');
    this.pokemons = getPokemonData();
    this.listPokemon = [];
    await this.getPokemonData();
    this.startCountdown();
  }

  flip(element: HTMLElement, boolean?: boolean) {
    if (!boolean) {
      this.renderer.setStyle(element.children[0], 'opacity', 1);
      this.renderer.setStyle(element.children[1], 'opacity', 0);
    } else {
      this.renderer.setStyle(element.children[0], 'opacity', 0);
      this.renderer.setStyle(element.children[1], 'opacity', 1);
    }

    const result = {
      id: Number(element.getAttribute('id')),
      element: element,
    };
    return result;
  }

  onClickCard(element: HTMLElement) {
    if (this.compare.length < 2) {
      this.soundClick.nativeElement.play();
      const card = this.flip(element);
      this.compare.push(card);

      if (
        this.compare[0].id === this.compare[1].id &&
        this.compare[0].element != this.compare[1].element
      ) {
        this.soundEat.nativeElement.play();
        this.renderer.setStyle(
          this.compare[0].element,
          'background-color',
          '#03FF5599'
        );
        this.renderer.setStyle(
          this.compare[1].element,
          'background-color',
          '#03FF5599'
        );

        this.point += 10;
        this.seconds += 10;

        setTimeout(() => {
          this.renderer.setStyle(
            this.compare[0].element,
            'visibility',
            'hidden'
          );
          this.renderer.setStyle(
            this.compare[1].element,
            'visibility',
            'hidden'
          );
          this.compare = [];

          if (this.scores < 70) {
            this.scores += 2;
            console.log(this.scores);
          } else {
            this.renderer.setStyle(
              this.startBtn.nativeElement,
              'display',
              'grid'
            );
            this.startBtn.nativeElement.children[0].children[0].innerText =
              'Victory';
            this.renderer.setStyle(
              this.startBtn.nativeElement.children[0].children[0],
              'font-size',
              '4rem'
            );
            this.startBtn.nativeElement.children[0].children[1].innerText =
              'Chơi lại';
          }
        }, 1500);
      } else {
        setTimeout(() => {
          this.flip(this.compare[0].element, true);
          this.flip(this.compare[1].element, true);
          this.compare = [];
        }, 1000);
      }
    }
  }

  startCountdown() {
    this.intervalId = setInterval(() => {
      if (this.seconds > 0) {
        this.seconds--;
      } else {
        if (this.minutes > 0) {
          this.minutes--;
          this.seconds = 59;
        } else {
          clearInterval(this.intervalId);
          this.soundOver.nativeElement.play();
          this.renderer.setStyle(
            this.startBtn.nativeElement,
            'display',
            'grid'
          );
          this.startBtn.nativeElement.children[0].children[0].innerText =
            'GAME OVER';
          this.startBtn.nativeElement.children[0].children[1].innerText =
            'Chơi lại';
          this.renderer.setStyle(
            this.startBtn.nativeElement.children[0].children[0],
            'font-size',
            '4rem'
          );
        }
      }
    }, 1000);
  }
}
