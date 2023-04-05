import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IRI} from "@janeirodigital/sai-api-messages";

@Component({
  selector: 'sai-access-modes-selector',
  templateUrl: './access-modes-selector.component.html',
  styleUrls: ['./access-modes-selector.component.scss']
})
export class AccessModesSelectorComponent implements OnInit {

  @Input() extras: string[] = []
  @Output() change = new EventEmitter<{mode: string}>();


  ngOnInit(): void {
  }

  modeSelected(mode: string): void {
    this.change.emit({ mode })
  }
}
