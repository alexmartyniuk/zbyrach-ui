import { Component, OnInit } from '@angular/core';
import { Tag } from '../../models/tag';
import { TagService } from '../../services/tag.service';
import { AccountService } from '../../services/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent implements OnInit {

  public currentTagName: string = "";

  public relatedTags: Map<string, Tag> = new Map<string, Tag>();

  public tags: Map<string, Tag> = new Map<string, Tag>();

  public isTagsExist(): boolean {
    return this.tags.size > 0;
  }

  public isRelatedTagsExist(): boolean {
    return this.relatedTags.size > 0;
  }

  constructor(private router: Router, private tagService: TagService, private accountService: AccountService) { }

  async ngOnInit() {
    this.accountService.loginStateChanged$.subscribe(async (logedin) => {
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

  async addCurrentTag(): Promise<any> {
    if (!this.currentTagName) {
      return;
    }

    if (!this.tags.get(this.currentTagName)) {
      let newTag: Tag = { 'name': this.currentTagName, 'url': null, 'parentTagName': null };
      this.tags.set(this.currentTagName, newTag);
      await this.getRelatedTags(newTag);
    }

    this.currentTagName = "";
  }

  async addTag(tag: Tag): Promise<any> {
    if (!this.tags.get(tag.name)) {
      this.tags.set(tag.name, tag);
      await this.getRelatedTags(tag);
    }

    this.currentTagName = "";
  }

  addRelatedTag(tag: Tag): void {
    if (!this.relatedTags.get(tag.name)) {
      this.relatedTags.set(tag.name, tag);
    }
  }

  onRemoveTag(tag: Tag): void {
    this.tags.delete(tag.name);

    for (let key of this.relatedTags.keys()) {
      let relatedTag = this.relatedTags.get(key);
      if (relatedTag.parentTagName == tag.name) {
        this.relatedTags.delete(key);
      }
    }
  }

  onClickTag(tag: Tag): void {
    //
  }

  onRemoveRelatedTag(tag: Tag): void {
    this.relatedTags.delete(tag.name);
  }

  onClickRelatedTag(tag: Tag): void {
    this.addTag(tag);
    this.onRemoveRelatedTag(tag);
  }

  async save(): Promise<void> {
    const tagNames = Array.from(this.tags.values()).map(t => t.name);
    await this.tagService.setMyTags(tagNames);

    this.router.navigate(['/mailing']);
  }

  private async getRelatedTags(tag: Tag): Promise<void> {
    let relatedTags = await this.tagService.getRelatedTags(tag.name);
    for (let relatedTag of relatedTags) {
      this.addRelatedTag(relatedTag);
    }
  }

}
