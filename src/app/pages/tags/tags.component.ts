import { Component, OnInit } from '@angular/core';
import { Tag } from '../../models/tag';
import { TagService } from '../../services/tag.service';
import { AccountService } from '../../services/account.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent implements OnInit {

  private loginStateSubscription: Subscription;

  public currentTagName: string = "";

  public relatedTags: Map<string, Tag> = new Map<string, Tag>();

  public tags: Map<string, Tag> = new Map<string, Tag>();

  public isTagsExist(): boolean {
    return this.tags.size > 0;
  }

  public isRelatedTagsExist(): boolean {
    return this.relatedTags.size > 0;
  }

  constructor(private router: Router, private tagService: TagService, private accountService: AccountService,
    private notificationService: NotificationService, private translate: TranslateService) { }

  async ngOnInit() {
    this.loginStateSubscription = this.accountService.loginStateChanged$.subscribe(async (logedin) => {
      if (logedin) {
        const tags = await this.tagService.getMyTags();

        for (let tag of tags) {
          this.addTag(tag);
        }
      } else {
        this.router.navigate(['/greeting']);
      }
    });
  }

  ngOnDestroy() {
    this.loginStateSubscription.unsubscribe();
  }

  public async addCurrentTag(): Promise<any> {
    if (!this.currentTagName) {
      return;
    }

    if (this.tags.get(this.currentTagName)) {
      this.currentTagName = "";
      return;
    }

    const tagExists = await this.tagService.isTagExist(this.currentTagName);
    if (!tagExists) {
      this.notificationService.showWarningMessage(this.translate.instant('Tags.TagWasNotFound', {tag: this.currentTagName}));
      return;
    }

    let newTag: Tag = { 'name': this.currentTagName, 'url': null, 'parentTagName': null };
    this.tags.set(this.currentTagName, newTag);
    await this.getRelatedTags(newTag);
    this.currentTagName = "";
  }

  public onRemoveTag(tagName: string): void {
    this.tags.delete(tagName);

    for (let key of this.relatedTags.keys()) {
      let relatedTag = this.relatedTags.get(key);
      if (relatedTag.parentTagName == tagName) {
        this.relatedTags.delete(key);
      }
    }
  }

  public onClickRelatedTag(tagName: string): void {
    const relatedTag = this.relatedTags.get(tagName)
    this.addTag(relatedTag);
    this.relatedTags.delete(relatedTag.name);
  }

  public async save(): Promise<void> {
    const tagNames = Array.from(this.tags.values()).map(t => t.name);
    await this.tagService.setMyTags(tagNames);

    this.router.navigate(['/mailing']);
  }

  private async addTag(tag: Tag): Promise<any> {
    if (!this.tags.get(tag.name)) {
      this.tags.set(tag.name, tag);
      await this.getRelatedTags(tag);
    }

    this.currentTagName = "";
  }

  private async getRelatedTags(tag: Tag): Promise<void> {
    const relatedTags = await this.tagService.getRelatedTags(tag.name);
    for (let relatedTag of relatedTags) {
      relatedTag.parentTagName = tag.name;
      this.relatedTags.set(relatedTag.name, relatedTag);
    }
  }

}
