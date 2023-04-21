import { useCallback, useEffect, useMemo, useRef } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

import { focusEditor, getPlateEditorRef, selectEditor } from "@udecode/plate";

import { tinykeys } from "@workduck-io/tinykeys";

import {
  ELEMENT_CAPTURE,
  getContent,
  useBlockStore,
  useContentStore,
  useDataStore,
  useEditorStore,
  useFloatingStore,
  useHelpStore,
  useLayoutStore,
  useModalStore,
} from "@mexit/core";
import { EditorWrapper, isOnEditableElement } from "@mexit/shared";

import { useComboboxOpen } from "../../Editor/Hooks/useComboboxOpen";
import { useApi } from "../../Hooks/API/useNodeAPI";
import {
  createViewFilterStore,
  ViewFilterProvider,
} from "../../Hooks/todo/useTodoFilters";
import { useKeyListener } from "../../Hooks/useChangeShortcutListener";
import { useComments } from "../../Hooks/useComments";
import { useBufferStore, useEditorBuffer } from "../../Hooks/useEditorBuffer";
import { useLastOpened } from "../../Hooks/useLastOpened";
import useLayout from "../../Hooks/useLayout";
import useLoad from "../../Hooks/useLoad";
import { isReadonly, usePermissions } from "../../Hooks/usePermissions";
import { useReactions } from "../../Hooks/useReactions";
import { useAnalysisTodoAutoUpdate } from "../../Stores/useAnalysis";
import { areEqual } from "../../Utils/hash";

import Editor from "./Editor";

const ContentEditor = () => {
  const { toggleFocusMode } = useLayout();
  const { saveApiAndUpdate } = useLoad();
  const setIsBlockMode = useBlockStore((store) => store.setIsBlockMode);
  const { accessWhenShared } = usePermissions();
  const { getAllCommentsOfNode } = useComments();
  const { getAllReactionsOfNode } = useReactions();

  const { getDataAPI } = useApi();
  const isComboOpen = useComboboxOpen();
  const _hasHydrated = useDataStore((state) => state._hasHydrated);

  const editorWrapperRef = useRef<HTMLDivElement>(null);
  const { debouncedAddLastOpened } = useLastOpened();

  const { addOrUpdateValBuffer, getBufferVal, saveAndClearBuffer } =
    useEditorBuffer();
  const nodeid = useParams()?.nodeId;
  const fsContent = useContentStore((state) => state.contents)[nodeid];
  const { shortcutHandler } = useKeyListener();
  const shortcuts = useHelpStore((store) => store.shortcuts);
  const isUserEditing = useEditorStore((store) => store.isEditing);

  const setInternalUpdate = useContentStore((store) => store.setInternalUpdate);

  const returnLastUpdatedContentOnError = (noteId: string, content: any) => {
    if (Array.isArray(content) && content.length !== 0) return content;
    return useBufferStore.getState().buffer?.[noteId];
  };

  const nodeContent = useMemo(() => {
    const internalUpdate = useContentStore.getState().internalUpdate;

    if (!internalUpdate) {
      return returnLastUpdatedContentOnError(nodeid, fsContent?.content);
    } else {
      setInternalUpdate(false);
      const fromContent = useContentStore.getState().contents[nodeid].content;
      return returnLastUpdatedContentOnError(nodeid, fromContent);
    }
  }, [nodeid, fsContent]);

  const onChangeSave = useCallback(
    async (val: any[]) => {
      if (val && nodeid !== "__null__") {
        addOrUpdateValBuffer(nodeid, val);
        debouncedAddLastOpened(nodeid);
      }
    },
    [nodeid],
  );

  const onAutoSave = useCallback((val) => {
    saveAndClearBuffer(false);
  }, []);

  useEffect(() => {
    return () => {
      const isBlockMode = useBlockStore.getState().isBlockMode;
      if (isBlockMode) setIsBlockMode(true);
      saveAndClearBuffer(false);
    };
  }, []);

  const onFocusClick = () => {
    const editorRef = getPlateEditorRef();
    if (editorRef) {
      if (editorWrapperRef.current) {
        selectEditor(editorRef, { focus: true, edge: "end" });
      }
    }
  };

  useAnalysisTodoAutoUpdate();

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [shortcuts.toggleFocusMode.keystrokes]: (event) => {
        event.preventDefault();
        shortcutHandler(shortcuts.toggleFocusMode, () => {
          toggleFocusMode();
        });
      },
      Enter: (event) => {
        if (
          !isOnEditableElement(event) &&
          !useModalStore.getState().open &&
          !useLayoutStore.getState().contextMenu &&
          !useFloatingStore.getState().floatingElement
        ) {
          event.preventDefault();
          const editorRef = getPlateEditorRef(nodeid) ?? getPlateEditorRef();
          focusEditor(editorRef);
        }
      },
      [shortcuts.refreshNode.keystrokes]: (event) => {
        event.preventDefault();

        shortcutHandler(shortcuts.refreshNode, () => {
          const node = useEditorStore.getState().node;
          const val = getBufferVal(node.nodeid);
          const content = getContent(node.nodeid);
          const res = areEqual(content.content, val);

          if (!res) {
            saveApiAndUpdate(node, val);
          } else {
            // * If buffer hasn't changed, refresh the note
            getDataAPI(node.nodeid, false, true);
            getAllCommentsOfNode(node.nodeid);
            getAllReactionsOfNode(node.nodeid);
          }
        });
      },
      [shortcuts.save.keystrokes]: (event) => {
        event.preventDefault();
        shortcutHandler(shortcuts.refreshNode, () => {
          saveAndClearBuffer();
          toast("Saved!");
        });
      },
    });

    return () => {
      unsubscribe();
    };
  }, [shortcuts, toggleFocusMode]);

  const viewOnly = useMemo(() => {
    const access = accessWhenShared(nodeid);
    return isReadonly(access);
  }, [nodeid, _hasHydrated]);

  const contentDemo = useMemo(() => {
    return [{
      id: "TEMP_123",
      type: ELEMENT_CAPTURE,
      children: [
        {
          "type": "h2",
          "id": "TEMP_gAcCH",
          "metadata": {
            "lastEditedBy": "7b73e65a-3745-45fc-8cb0-fce6b54197bd",
            "updatedAt": 1681544696183,
            "createdBy": "7b73e65a-3745-45fc-8cb0-fce6b54197bd",
            "createdAt": 1681544696183,
          },
          "align": "start",
          "children": [
            {
              "type": "p",
              "id": "TEMP_AWCdD",
              "metadata": {},
              "text": "Background",
            },
            {
              "type": "p",
              "id": "TEMP_NUBTJ",
              "metadata": {},
              "text": "[",
            },
            {
              "type": "a",
              "url":
                "https://en.wikipedia.org/w/index.php?title=Federal_Statistical_System_of_the_United_States&action=edit&section=1",
              "id": "TEMP_Rcjcz",
              "children": [
                {
                  "type": "p",
                  "id": "TEMP_9jwFQ",
                  "metadata": {},
                  "text": "edit",
                },
              ],
            },
            {
              "type": "p",
              "id": "TEMP_bW83Y",
              "metadata": {},
              "text": "]",
            },
          ],
        },
        {
          "type": "p",
          "id": "TEMP_kKYLF",
          "metadata": {
            "lastEditedBy": "7b73e65a-3745-45fc-8cb0-fce6b54197bd",
            "updatedAt": 1681544867730,
            "createdBy": "7b73e65a-3745-45fc-8cb0-fce6b54197bd",
            "createdAt": 1681544696183,
          },
          "align": "start",
          "children": [
            {
              "type": "p",
              "id": "TEMP_cqCTd",
              "metadata": {},
              "text":
                "In contrast to many other countries, the United States does not have a primary statistical agency.",
            },
            {
              "type": "a",
              "url":
                "https://en.wikipedia.org/wiki/Federal_Statistical_System_of_the_United_States#cite_note-GAO-12-54-1",
              "id": "TEMP_QjDtG",
              "children": [
                {
                  "type": "p",
                  "id": "TEMP_pWfiB",
                  "metadata": {},
                  "text": "[1]",
                },
              ],
            },
            {
              "type": "p",
              "id": "TEMP_Dj7QC",
              "metadata": {},
              "text": " ",
            },
            {
              "type": "p",
              "id": "TEMP_gPUbj",
              "metadata": {},
              "text": "Instead, th",
            },
          ],
        },
        {
          "type": "p",
          "id": "TEMP_Ujtrc",
          "metadata": {
            "lastEditedBy": "7b73e65a-3745-45fc-8cb0-fce6b54197bd",
            "updatedAt": 1681544867674,
            "createdBy": "7b73e65a-3745-45fc-8cb0-fce6b54197bd",
            "createdAt": 1681544867674,
          },
          "children": [
            {
              "type": "p",
              "id": "TEMP_zfxAy",
              "metadata": {},
              "text": "Decentralized agencies.sdf",
            },
          ],
        },
        {
          "type": "h2",
          "id": "TEMP_g7qcq",
          "metadata": {
            "lastEditedBy": "7b73e65a-3745-45fc-8cb0-fce6b54197bd",
            "updatedAt": 1681544867674,
            "createdBy": "7b73e65a-3745-45fc-8cb0-fce6b54197bd",
            "createdAt": 1681544867674,
          },
          "children": [
            {
              "type": "p",
              "id": "TEMP_nqQTE",
              "metadata": {},
              "text": "Word count",
            },
          ],
        },
        {
          "type": "p",
          "id": "TEMP_4ftCa",
          "metadata": {
            "lastEditedBy": "7b73e65a-3745-45fc-8cb0-fce6b54197bd",
            "updatedAt": 1681544867674,
            "createdBy": "7b73e65a-3745-45fc-8cb0-fce6b54197bd",
            "createdAt": 1681544867674,
          },
          "children": [
            {
              "type": "p",
              "id": "TEMP_AcqGY",
              "metadata": {},
              "text": "Total words: 2",
            },
          ],
        },
        {
          "type": "p",
          "id": "TEMP_e4ehY",
          "metadata": {
            "lastEditedBy": "7b73e65a-3745-45fc-8cb0-fce6b54197bd",
            "updatedAt": 1681544867674,
            "createdBy": "7b73e65a-3745-45fc-8cb0-fce6b54197bd",
            "createdAt": 1681544867674,
          },
          "align": "start",
          "children": [
            {
              "type": "p",
              "id": "TEMP_Tzwm9",
              "metadata": {},
              "text": "ir mission.",
            },
          ],
        },
        {
          "type": "p",
          "id": "TEMP_byxUm",
          "metadata": {
            "lastEditedBy": "7b73e65a-3745-45fc-8cb0-fce6b54197bd",
            "updatedAt": 1681544867674,
            "createdBy": "7b73e65a-3745-45fc-8cb0-fce6b54197bd",
            "createdAt": 1681544867674,
          },
          "align": "start",
          "children": [
            {
              "type": "p",
              "id": "TEMP_pDHaj",
              "metadata": {},
              "text":
                "As of fiscal year 2013 (FY13), the 13 principal statistical agencies have statistical activities as their core mission and conduct much of the government’s statistical work.",
            },
            {
              "type": "a",
              "url":
                "https://en.wikipedia.org/wiki/Federal_Statistical_System_of_the_United_States#cite_note-GAO-12-54-1",
              "id": "TEMP_RqkNb",
              "children": [
                {
                  "type": "p",
                  "id": "TEMP_tTrbe",
                  "metadata": {},
                  "text": "[1]",
                },
              ],
            },
            {
              "type": "p",
              "id": "TEMP_FaFRm",
              "metadata": {},
              "text": " ",
            },
            {
              "type": "p",
              "id": "TEMP_bEdby",
              "metadata": {},
              "text":
                "A further 89 federal agencies were appropriated at least $500,000 of statistical work in FY11, FY12, or FY13 in conjunction with their primary missions.",
            },
            {
              "type": "a",
              "url":
                "https://en.wikipedia.org/wiki/Federal_Statistical_System_of_the_United_States#cite_note-OMB-FY13-StatSystemReport-2",
              "id": "TEMP_j73VJ",
              "children": [
                {
                  "type": "p",
                  "id": "TEMP_BXWhb",
                  "metadata": {},
                  "text": "[2]",
                },
              ],
            },
            {
              "type": "p",
              "id": "TEMP_pdYaz",
              "metadata": {},
              "text": " ",
            },
            {
              "type": "p",
              "id": "TEMP_6ipQC",
              "metadata": {},
              "text":
                "All together, the total budget allocated to the Federal Statistical System is estimated to be $6.7 billion for FY13.",
            },
            {
              "type": "a",
              "url":
                "https://en.wikipedia.org/wiki/Federal_Statistical_System_of_the_United_States#cite_note-OMB-FY13-StatSystemReport-2",
              "id": "TEMP_rcg4j",
              "children": [
                {
                  "type": "p",
                  "id": "TEMP_KqLcB",
                  "metadata": {},
                  "text": "[2]",
                },
              ],
            },
            {
              "type": "p",
              "id": "TEMP_HJPRw",
              "metadata": {},
              "text": "",
            },
          ],
        },
        {
          "type": "p",
          "id": "TEMP_ARn6x",
          "metadata": {
            "lastEditedBy": "7b73e65a-3745-45fc-8cb0-fce6b54197bd",
            "updatedAt": 1681544696183,
            "createdBy": "7b73e65a-3745-45fc-8cb0-fce6b54197bd",
            "createdAt": 1681544696183,
          },
          "align": "start",
          "children": [
            {
              "type": "p",
              "id": "TEMP_w8LtN",
              "metadata": {},
              "text":
                "The Federal Statistical System is coordinated through the",
            },
            {
              "type": "p",
              "id": "TEMP_AaVhj",
              "metadata": {},
              "text": " ",
            },
            {
              "type": "a",
              "url":
                "https://en.wikipedia.org/wiki/Office_of_Management_and_Budget",
              "id": "TEMP_yNmV7",
              "children": [
                {
                  "type": "p",
                  "id": "TEMP_eyD3W",
                  "metadata": {},
                  "text": "Office of Management and Budget",
                },
              ],
            },
            {
              "type": "p",
              "id": "TEMP_GtkXx",
              "metadata": {},
              "text": " ",
            },
            {
              "type": "p",
              "id": "TEMP_kBNL6",
              "metadata": {},
              "text":
                "(OMB). OMB establishes and enforces statistical policies and standards, ensures that resources are proposed for priority statistical programs, and approves statistical surveys conducted by the Federal government under the",
            },
            {
              "type": "p",
              "id": "TEMP_nECLW",
              "metadata": {},
              "text": " ",
            },
            {
              "type": "a",
              "url": "https://en.wikipedia.org/wiki/Paperwork_Reduction_Act",
              "id": "TEMP_DJNe7",
              "children": [
                {
                  "type": "p",
                  "id": "TEMP_cRxyA",
                  "metadata": {},
                  "text": "Paperwork Reduction Act",
                },
              ],
            },
            {
              "type": "p",
              "id": "TEMP_cbN9D",
              "metadata": {},
              "text": ".",
            },
            {
              "type": "a",
              "url":
                "https://en.wikipedia.org/wiki/Federal_Statistical_System_of_the_United_States#cite_note-ChiefStatisticianPresentation-3",
              "id": "TEMP_eDnbg",
              "children": [
                {
                  "type": "p",
                  "id": "TEMP_XBDD4",
                  "metadata": {},
                  "text": "[3]",
                },
              ],
            },
            {
              "type": "p",
              "id": "TEMP_3CyBw",
              "metadata": {},
              "text": " ",
            },
            {
              "type": "p",
              "id": "TEMP_zxXhP",
              "metadata": {},
              "text": "The",
            },
            {
              "type": "p",
              "id": "TEMP_dbmKn",
              "metadata": {},
              "text": " ",
            },
            {
              "type": "a",
              "url":
                "https://en.wikipedia.org/wiki/Chief_Statistician_of_the_United_States",
              "id": "TEMP_wx9Tb",
              "children": [
                {
                  "type": "p",
                  "id": "TEMP_8Wt3U",
                  "metadata": {},
                  "text": "Chief Statistician of the United States",
                },
              ],
            },
            {
              "type": "p",
              "id": "TEMP_HM9Er",
              "metadata": {},
              "text":
                ", also housed within OMB, provides oversight, coordination, and guidance for Federal statistical activities, working in collaboration with leaders of statistical agencies.",
            },
            {
              "type": "a",
              "url":
                "https://en.wikipedia.org/wiki/Federal_Statistical_System_of_the_United_States#cite_note-ChiefStatisticianPresentation-3",
              "id": "TEMP_ijNFW",
              "children": [
                {
                  "type": "p",
                  "id": "TEMP_fBWNe",
                  "metadata": {},
                  "text": "[3]",
                },
              ],
            },
            {
              "type": "p",
              "id": "TEMP_3tbGD",
              "metadata": {},
              "text": "",
            },
          ],
        },
      ],
      captureId: "HIGHLIGHT_3331",
    }];
  }, []);

  return (
    <EditorWrapper
      comboboxOpen={isComboOpen}
      isUserEditing={isUserEditing}
      ref={editorWrapperRef}
    >
      <ViewFilterProvider createStore={createViewFilterStore}>
        <Editor
          onAutoSave={onAutoSave}
          onFocusClick={onFocusClick}
          includeBlockInfo={true}
          onChange={onChangeSave}
          content={contentDemo}
          nodeUID={nodeid}
          readOnly={viewOnly}
          autoFocus={false}
        />
      </ViewFilterProvider>
    </EditorWrapper>
  );
};

export default ContentEditor;
