import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tag-item',
  templateUrl: './tag-item.component.html',
  styleUrls: ['./tag-item.component.css']
})
export class TagComponent implements OnInit {

  constructor(private translate: TranslateService) { }

  ngOnInit() {
  }

  @Input() tag: string;

  @Input() isRemovingAllowed: boolean = true;

  @Input() isActive: boolean = true;

  @Input() isSmall: boolean = false;

  @Output() onRemove: EventEmitter<string> = new EventEmitter<string>();

  @Output() onClick: EventEmitter<string> = new EventEmitter<string>();

  onRemoveButtonClick(): void {
    this.onRemove.emit(this.tag);
  }

  onElementClick(): void {
    this.onClick.emit(this.tag);
  }

  public get title() {
    return !this.isRemovingAllowed ? this.translate.instant('Tags.AddTag') : undefined
  }

}
