//
//  RNCoreFileViewerModule.swift
//  RNCoreFileViewerModule
//
//  Copyright © 2022 Catalin Cor. All rights reserved.
//

import Foundation

@objc(RNCoreFileViewerModule)
class RNCoreFileViewerModule: NSObject {
  @objc
  func constantsToExport() -> [AnyHashable : Any]! {
    return ["count": 1]
  }

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
