# Supported for Cocos Service!
        if(USE_ANALYTICS AND IOS)
            set(FRAMEWORK_NAME CocosAnalytics)
            target_link_libraries(${CC_TARGET_NAME}  "-ObjC" ${CMAKE_CURRENT_LIST_DIR}/${FRAMEWORK_NAME}.framework)
            target_include_directories(${CC_TARGET_NAME} PUBLIC ${CMAKE_CURRENT_LIST_DIR}/${FRAMEWORK_NAME}.framework/Headers)
    
        endif()