import { Injectable } from '@angular/core';
import { Tag } from '../models/tag';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  constructor(private api: ApiService) { }

  public async getRelatedTags(name: string): Promise<Tag[]> {
    let relatedTags: Tag[] = await this.api.getRelatedTags(name);

    for (let relatedTag of relatedTags) {
      relatedTag.parentTagName = name;
    }

    return relatedTags;
  }

  public async isTagExist(name: string): Promise<boolean> {
    try {
      await this.api.getShortTagInfo(name);
      return true;
    }
    catch (error) {
      if (error.status === 404) {
        return false;
      }
      throw error;
    }
  }

  public async getMyTags(): Promise<Tag[]> {
    return this.api.getMyTags();
  }

  public async setMyTags(tags: string[]): Promise<void> {
    return this.api.setMyTags(tags);
  }
}
